import React, { useEffect, useMemo, useState } from 'react';
import { useUserPage } from '../../hooks/useUserPage';

function getContrastRatio(first: string, second: string): number {
  const luminance = (color: string) => {
    const channels = color.slice(1).match(/.{2}/g)?.map((channel) => {
      const value = parseInt(channel, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    if (!channels || channels.length !== 3) return 0;
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

export const QrCodePage: React.FC = () => {
  const { profile, loading, error } = useUserPage();
  const [foreground, setForeground] = useState('#0f172a');
  const [background, setBackground] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [generationError, setGenerationError] = useState('');
  const publicUrl = useMemo(
    () => profile ? `${window.location.origin}/u/${encodeURIComponent(profile.username)}` : '',
    [profile],
  );
  const hasReadableContrast = getContrastRatio(foreground, background) >= 4.5;

  useEffect(() => {
    let cancelled = false;
    setGenerationError('');
    setQrDataUrl('');
    if (!publicUrl) {
      return () => { cancelled = true; };
    }

    import('qrcode').then(({ default: QRCode }) => QRCode.toDataURL(publicUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 512,
      color: { dark: foreground, light: background },
    })).then((dataUrl) => {
      if (!cancelled) setQrDataUrl(dataUrl);
    }).catch((caught: unknown) => {
      if (cancelled) return;
      setGenerationError(caught instanceof Error ? caught.message : 'Impossible de générer le QR code.');
      setQrDataUrl('');
    });

    return () => { cancelled = true; };
  }, [publicUrl, foreground, background]);

  if (loading) return <div className="p-6 text-slate-400">Chargement de votre page...</div>;
  if (error) return <div role="alert" className="m-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">Impossible de charger la page : {error}</div>;
  if (!profile) return <div className="p-6 text-sm text-slate-400">Aucune page n’est associée à ce compte.</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-5 sm:p-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Partage en un scan</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Mon QR code</h1>
        <p className="mt-2 text-sm text-slate-400">Télécharge-le pour l’ajouter à tes affiches, vidéos ou supports imprimés.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-5 rounded-2xl border border-white/[0.08] bg-slate-900 p-5 sm:p-7">
          <div>
            <h2 className="text-sm font-semibold text-white">Aperçu</h2>
            <a href={publicUrl} target="_blank" rel="noreferrer" className="mt-1 block break-all text-xs text-blue-300 hover:text-blue-200">{publicUrl}</a>
          </div>
          <div className="flex min-h-72 items-center justify-center rounded-2xl bg-slate-950 p-6">
            {qrDataUrl
              ? <img src={qrDataUrl} alt={`QR code vers ${publicUrl}`} className="h-64 w-64 rounded-lg" />
              : <span className="text-sm text-slate-500">Génération du QR code…</span>}
          </div>
          {generationError && <p role="alert" className="text-sm text-red-300">{generationError}</p>}
          {!hasReadableContrast && <p role="status" className="text-xs text-amber-300">Augmente le contraste pour activer le téléchargement et garantir un scan fiable.</p>}
          {qrDataUrl && hasReadableContrast
            ? <a href={qrDataUrl} download={`${profile.username}-boostly-qr.png`} className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">Télécharger le PNG</a>
            : <button type="button" disabled className="w-full cursor-not-allowed rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-500">Télécharger le PNG</button>}
        </section>

        <aside className="h-fit space-y-5 rounded-2xl border border-white/[0.08] bg-slate-900 p-5">
          <div>
            <h2 className="text-sm font-semibold text-white">Personnaliser les couleurs</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">Garde un bon contraste entre les deux couleurs pour que le code reste facile à scanner.</p>
          </div>
          <label className="flex items-center justify-between gap-4 text-sm text-slate-300">
            Modules du QR
            <input type="color" value={foreground} onChange={(event) => setForeground(event.target.value)} className="h-10 w-14 cursor-pointer rounded border-0 bg-transparent" />
          </label>
          <label className="flex items-center justify-between gap-4 text-sm text-slate-300">
            Arrière-plan
            <input type="color" value={background} onChange={(event) => setBackground(event.target.value)} className="h-10 w-14 cursor-pointer rounded border-0 bg-transparent" />
          </label>
          <button type="button" onClick={() => { setForeground('#0f172a'); setBackground('#ffffff'); }} className="w-full rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5">
            Rétablir le contraste recommandé
          </button>
        </aside>
      </div>
    </div>
  );
};
