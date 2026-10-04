import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401, headers: corsHeaders });

    const { data: page } = await supabaseClient.from('pages').select('id').eq('user_id', user.id).single();
    if (!page) return new Response(JSON.stringify({ recommendations: [] }), { headers: corsHeaders });

    const { count: views } = await supabaseClient.from('page_views').select('*', { count: 'exact', head: true }).eq('page_id', page.id);
    const { data: clicks } = await supabaseClient.from('link_clicks').select('link_id').eq('page_id', page.id);
    const { data: links } = await supabaseClient.from('links').select('*').eq('page_id', page.id).eq('is_active', true);

    const recommendations = [];
    const totalViews = views || 0;
    const totalClicks = clicks?.length || 0;

    if (totalViews < 5) {
      recommendations.push({
        type: 'general',
        title: 'Données insuffisantes',
        message: 'Continuez à partager votre page pour obtenir suffisamment de données réelles pour une analyse.'
      });
    } else {
      if (links && links.length > 6) {
        recommendations.push({
          type: 'ordering',
          title: 'Simplifiez votre page',
          message: `Vous avez ${links.length} liens actifs. Réduire ce nombre aux 4 ou 5 plus importants augmentera la visibilité de chacun.`
        });
      }
      const ctr = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
      if (ctr < 5.0) {
        recommendations.push({
          type: 'cta',
          title: 'Améliorez vos appels à l\'action',
          message: 'Votre taux de clic est inférieur à 5%. Utilisez des verbes d\'action plus clairs pour vos titres de liens.'
        });
      }
    }

    return new Response(JSON.stringify({ recommendations, analyzed_at: new Date().toISOString() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});