import { supabase } from '../lib/supabase';
import { AnalyticsSummary } from '../types/database.types';

export async function getAnalyticsSummary(pageId: string, days = 30): Promise<AnalyticsSummary> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const since = startDate.toISOString();

  const [viewsResult, linksResult] = await Promise.all([
    supabase
      .from('page_views')
      .select('id', { count: 'exact', head: true })
      .eq('page_id', pageId)
      .gte('created_at', since),
    supabase
      .from('links')
      .select('id, title, url')
      .eq('page_id', pageId),
  ]);

  if (viewsResult.error) throw viewsResult.error;
  if (linksResult.error) throw linksResult.error;

  const views = viewsResult.count ?? 0;
  const clicks: Array<{ link_id: string }> = [];
  const pageSize = 1000;
  let offset = 0;

  while (true) {
    const clicksResult = await supabase
      .from('link_clicks')
      .select('link_id')
      .eq('page_id', pageId)
      .gte('created_at', since)
      .range(offset, offset + pageSize - 1);

    if (clicksResult.error) throw clicksResult.error;
    clicks.push(...(clicksResult.data ?? []));
    if (!clicksResult.data || clicksResult.data.length < pageSize) break;
    offset += pageSize;
  }

  const clickCounts = new Map<string, number>();

  for (const click of clicks) {
    clickCounts.set(click.link_id, (clickCounts.get(click.link_id) ?? 0) + 1);
  }

  const popularLinks = (linksResult.data ?? [])
    .map((link) => ({
      link_id: link.id,
      title: link.title,
      url: link.url,
      clicks: clickCounts.get(link.id) ?? 0,
    }))
    .filter((link) => link.clicks > 0)
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  return {
    views,
    clicks: clicks.length,
    ctr: views > 0 ? (clicks.length / views) * 100 : 0,
    popularLinks,
  };
}