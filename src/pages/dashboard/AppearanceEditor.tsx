import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserPage } from '../../hooks/useUserPage';
import { PRESET_THEMES } from '../../lib/constants';
import {
  getUserImagePath,
  removeUserImage,
  updatePage,
  updateProfile,
  uploadUserImage,
  UploadedUserImage,
} from '../../services/pageService';
import { LivePreview } from '../../components/preview/LivePreview';
import { PageConfig, Profile } from '../../types/database.types';

const inputClassName = 'w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500';
const cardClassName = 'space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5';

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return fallback;
}

export const AppearanceEditor: React.FC = () => {
  const { user } = useAuth();
  const { profile, page, links, loading, error, refresh, setPage, setProfile } = useUserPage();
  const [draftProfile, setDraftProfile] = useState<Profile | null>(null);
  const [draftPage, setDraftPage] = useState<PageConfig | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveNotice, setSaveNotice] = useState('');

  useEffect(() => {
    if (profile) setDraftProfile({ ...profile });
    if (page) setDraftPage({ ...page });
    setAvatarFile(null);
    setBackgroundFile(null);
  }, [profile, page]);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(draftProfile?.avatar_url ?? null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile, draftProfile?.avatar_url]);

  useEffect(() => {
    if (!backgroundFile) {
      setBackgroundPreview(draftPage?.background_image_url ?? null);
      return;
    }
    const url = URL.createObjectURL(backgroundFile);
    setBackgroundPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [backgroundFile, draftPage?.background_image_url]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile || !page || !draftProfile || !draftPage || !user) return;

    setSaving(true);
    setSaveError('');
    setSaveNotice('');
    let uploadedAvatar: UploadedUserImage | null = null;
    let uploadedBackground: UploadedUserImage | null = null;
    let pageUpdateAttempted = false;

    try {
      if (avatarFile) uploadedAvatar = await uploadUserImage(user.id, 'avatar', avatarFile);
      if (backgroundFile) uploadedBackground = await uploadUserImage(user.id, 'background', backgroundFile);

      const nextProfile = {
        ...draftProfile,
        avatar_url: uploadedAvatar?.publicUrl ?? draftProfile.avatar_url,
      };
      const nextPage = {
        ...draftPage,
        background_image_url: uploadedBackground?.publicUrl ?? draftPage.background_image_url,
      };

      pageUpdateAttempted = true;
      await updatePage(page.id, {
        title: nextPage.title,
        theme: nextPage.theme,
        background_color: nextPage.background_color,
        background_image_url: nextPage.background_image_url,
        accent_color: nextPage.accent_color,
        button_style: nextPage.button_style,
        font_family: nextPage.font_family,
      });
      try {
        await updateProfile(profile.id, {
          display_name: nextProfile.display_name,
          bio: nextProfile.bio,
          avatar_url: nextProfile.avatar_url,
        });
      } catch (profileError) {
        await updatePage(page.id, {
          title: page.title,
          theme: page.theme,
          background_color: page.background_color,
          background_image_url: page.background_image_url,
          accent_color: page.accent_color,
          button_style: page.button_style,
          font_family: page.font_family,
        });
        pageUpdateAttempted = false;
        throw profileError;
      }

      setProfile(nextProfile);
      setPage(nextPage);
      setDraftProfile(nextProfile);
      setDraftPage(nextPage);
      setAvatarFile(null);
      setBackgroundFile(null);
      setSaveNotice('Tes personnalisations sont enregistrées.');

      const oldImagePaths = [
        draftProfile.avatar_url !== nextProfile.avatar_url ? getUserImagePath(profile.avatar_url, user.id) : null,
        draftPage.background_image_url !== nextPage.background_image_url
          ? getUserImagePath(page.background_image_url, user.id)
          : null,
      ].filter((path): path is string => path !== null);
      const cleanupResults = await Promise.allSettled(
        oldImagePaths.map((path) => removeUserImage(path, user.id)),
      );
      if (cleanupResults.some((result) => result.status === 'rejected')) {
        setSaveNotice("Personnalisations enregistrées. Une ancienne image n'a pas pu être supprimée.");
      }
    } catch (caught) {
      const cleanupResults = await Promise.allSettled(
        [uploadedAvatar?.path, uploadedBackground?.path]
          .filter((path): path is string => path !== undefined)
          .map((path) => removeUserImage(path, user.id)),
      );
      const cleanupWarning = cleanupResults.some((result) => result.status === 'rejected')
        ? " Une image envoyée n'a pas pu être nettoyée."
        : '';
      const rollbackWarning = pageUpdateAttempted
        ? " La sauvegarde de la page a échoué; vérifie son état avant de réessayer."
        : '';
      setSaveError(`${getErrorMessage(caught, "Impossible d'enregistrer les personnalisations.")}${rollbackWarning}${cleanupWarning}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-slate-400">Chargement de votre apparence...</div>;

  if (error) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 p-6">
        <h1 className="text-2xl font-bold text-white">Apparence</h1>
        <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          Impossible de charger votre page : {error}
        </div>
        <button type="button" onClick={() => void refresh()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500">
          Réessayer
        </button>
      </div>
    );
  }

  if (!profile || !page || !draftProfile || !draftPage) {
    return <div className="p-6 text-sm text-slate-400">Aucune page n’est associée à ce compte.</div>;
  }

  const updateDraftPage = <Key extends keyof PageConfig>(key: Key, value: PageConfig[Key]) => {
    setDraftPage((current) => current ? { ...current, [key]: value } : current);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 p-5 sm:p-8 lg:flex-row">
      <form onSubmit={(event) => void handleSave(event)} className="min-w-0 flex-1 space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Votre identité, vos règles</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Personnaliser ma page</h1>
          <p className="mt-2 text-sm text-slate-400">Modifie ton profil, tes couleurs et tes images, puis enregistre en une fois.</p>
        </div>

        {saveError && <div role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{saveError}</div>}
        {saveNotice && <div role="status" className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">{saveNotice}</div>}

        <section className={cardClassName}>
          <div>
            <h2 className="text-sm font-semibold text-white">Profil public</h2>
            <p className="mt-1 text-xs text-slate-500">Ces informations apparaissent en haut de ta page.</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-slate-800 text-2xl font-bold text-white">
              {avatarPreview
                ? <img src={avatarPreview} alt="Aperçu de la photo de profil" className="h-full w-full object-cover" />
                : (draftProfile.display_name || draftProfile.username).charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="cursor-pointer rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10">
                Choisir une photo
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      setAvatarFile(file);
                      setSaveError('');
                      setSaveNotice('');
                    }
                    event.target.value = '';
                  }}
                />
              </label>
              {(avatarPreview || avatarFile) && (
                <button
                  type="button"
                  onClick={() => {
                    setAvatarFile(null);
                    setDraftProfile((current) => current ? { ...current, avatar_url: null } : current);
                  }}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:text-red-300"
                >
                  Retirer
                </button>
              )}
              <span className="w-full text-xs text-slate-500">PNG, JPG ou WebP · 8 Mo maximum</span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-xs text-slate-400">
              Nom affiché
              <input
                className={inputClassName}
                maxLength={60}
                value={draftProfile.display_name ?? ''}
                onChange={(event) => setDraftProfile({ ...draftProfile, display_name: event.target.value })}
                placeholder="Ton nom ou ta marque"
              />
            </label>
            <label className="space-y-1.5 text-xs text-slate-400">
              Titre de la page
              <input
                className={inputClassName}
                maxLength={80}
                value={draftPage.title ?? ''}
                onChange={(event) => updateDraftPage('title', event.target.value || null)}
                placeholder="Titre affiché sur ta page"
              />
            </label>
          </div>
          <label className="block space-y-1.5 text-xs text-slate-400">
            Bio
            <textarea
              className={`${inputClassName} min-h-24 resize-y`}
              maxLength={240}
              value={draftProfile.bio ?? ''}
              onChange={(event) => setDraftProfile({ ...draftProfile, bio: event.target.value || null })}
              placeholder="Présente-toi en quelques mots…"
            />
          </label>
        </section>

        <section className={cardClassName}>
          <div>
            <h2 className="text-sm font-semibold text-white">Image d’arrière-plan</h2>
            <p className="mt-1 text-xs text-slate-500">Ajoute une image personnalisée à ta page publique.</p>
          </div>
          {backgroundPreview && (
            <div
              role="img"
              aria-label="Aperçu de l’arrière-plan personnalisé"
              className="h-32 rounded-xl border border-white/10 bg-cover bg-center"
              style={{ backgroundImage: `url("${backgroundPreview}")` }}
            />
          )}
          <div className="flex flex-wrap items-center gap-2">
            <label className="cursor-pointer rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10">
              Importer une image
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setBackgroundFile(file);
                    setSaveError('');
                    setSaveNotice('');
                  }
                  event.target.value = '';
                }}
              />
            </label>
            {(backgroundPreview || backgroundFile) && (
              <button
                type="button"
                onClick={() => {
                  setBackgroundFile(null);
                  updateDraftPage('background_image_url', null);
                }}
                className="rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:text-red-300"
              >
                Retirer l’image
              </button>
            )}
            <span className="text-xs text-slate-500">PNG, JPG ou WebP · 8 Mo maximum</span>
          </div>
        </section>

        <section className={cardClassName}>
          <div>
            <h2 className="text-sm font-semibold text-white">Thèmes prédéfinis</h2>
            <p className="mt-1 text-xs text-slate-500">Choisis une base, puis ajuste les couleurs ci-dessous.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PRESET_THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setDraftPage({ ...draftPage, theme: theme.id, background_color: theme.bg, accent_color: theme.accent })}
                className={`flex flex-col space-y-2 rounded-lg border p-3 text-left transition ${
                  draftPage.theme === theme.id ? 'border-blue-500 bg-slate-800' : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: theme.bg }} />
                  <span className="h-4 w-4 rounded-full" style={{ backgroundColor: theme.accent }} />
                </span>
                <span className="text-xs font-medium text-white">{theme.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={cardClassName}>
          <h2 className="text-sm font-semibold text-white">Couleurs & typographie</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
              Couleur d’arrière-plan
              <input
                type="color"
                value={draftPage.background_color}
                onChange={(event) => updateDraftPage('background_color', event.target.value)}
                className="h-9 w-12 cursor-pointer rounded bg-transparent"
              />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
              Couleur des boutons
              <input
                type="color"
                value={draftPage.accent_color}
                onChange={(event) => updateDraftPage('accent_color', event.target.value)}
                className="h-9 w-12 cursor-pointer rounded bg-transparent"
              />
            </label>
            <label className="space-y-1.5 text-xs text-slate-400">
              Police d’écriture
              <select className={inputClassName} value={draftPage.font_family} onChange={(event) => updateDraftPage('font_family', event.target.value)}>
                <option value="Inter">Inter</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="system-ui, sans-serif">Système</option>
                <option value="monospace">Monospace</option>
              </select>
            </label>
            <label className="space-y-1.5 text-xs text-slate-400">
              Forme des boutons
              <select
                className={inputClassName}
                value={draftPage.button_style}
                onChange={(event) => updateDraftPage('button_style', event.target.value as PageConfig['button_style'])}
              >
                <option value="rounded">Arrondis</option>
                <option value="pill">Pilule</option>
                <option value="square">Carrés</option>
                <option value="outline">Contour</option>
              </select>
            </label>
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/15 transition hover:bg-blue-400 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          {saving ? 'Enregistrement…' : 'Enregistrer mes personnalisations'}
        </button>
      </form>

      <aside className="mx-auto w-full shrink-0 lg:sticky lg:top-6 lg:mx-0 lg:w-[320px] lg:self-start">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Aperçu en direct</p>
        <LivePreview profile={draftProfile} page={draftPage} links={links} />
      </aside>
    </div>
  );
};
