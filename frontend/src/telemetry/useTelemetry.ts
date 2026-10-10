'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchLatestTelemetry } from '@/services/api';
import { EMPTY_TELEMETRY, type CanonicalTelemetry } from './index';

export function useTelemetry(nodeId = 'NODE-01') {
  const [telemetry, setTelemetry] = useState<CanonicalTelemetry>(EMPTY_TELEMETRY);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    try {
      const next = await fetchLatestTelemetry(nodeId, signal);
      if (next) {
        setTelemetry(next);
      } else {
        setTelemetry({ ...EMPTY_TELEMETRY, nodeId });
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setTelemetry({
        ...EMPTY_TELEMETRY,
        nodeId,
        lastError: 'No live telemetry received from the UNO Q.',
      });
    } finally {
      setLoading(false);
    }
  }, [nodeId]);

  useEffect(() => {
    const controller = new AbortController();
    void refresh(controller.signal);
    const interval = window.setInterval(() => void refresh(), 5000);
    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, [refresh]);

  return { telemetry, loading };
}
