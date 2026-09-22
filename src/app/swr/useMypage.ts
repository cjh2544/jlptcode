import useSWR from "swr";

const savedWordKey = { url: "/api/mypage/saved-word", params: {} };
const savedSpeakKey = { url: "/api/mypage/saved-speak", params: {} };
const progressKey = { url: "/api/mypage/progress", params: {} };
const achievementKey = { url: "/api/mypage/achievement", params: {} };

export function savedKey(source: string, sourceId: string) {
  return `${source}:${sourceId}`;
}

export function useSavedWords(enabled = true) {
  const { data, error, isLoading, mutate } = useSWR(enabled ? savedWordKey : null);
  const items = data?.items || [];
  const keys = new Set(items.map((item: any) => savedKey(item.source, item.sourceId)));
  return { items, keys, error, isLoading, mutate };
}

export function useSavedSpeaks(enabled = true) {
  const { data, error, isLoading, mutate } = useSWR(enabled ? savedSpeakKey : null);
  const items = data?.items || [];
  const keys = new Set(items.map((item: any) => savedKey(item.source, item.sourceId)));
  return { items, keys, error, isLoading, mutate };
}

export function useMypageProgress() {
  const { data, error, isLoading, mutate } = useSWR(progressKey);
  return {
    items: data?.items || [],
    history: data?.history || [],
    error,
    isLoading,
    mutate,
  };
}

export function useMypageAchievement() {
  const { data, error, isLoading, mutate } = useSWR(achievementKey);
  return { items: data?.items || [], error, isLoading, mutate };
}
