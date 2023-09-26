import cache from "../services/cache";
import arbitrageService from "../services/arbitrageService";
import { Opportunity } from "../types";

const CACHED_PROFITABILITIES_KEY = 'CACHED_PROFITABILITIES_KEY';

interface ProfitabilityResponse {
  opportunities: Opportunity[];
  fetchedAt: number;
}

export default {
  async profitable(): Promise<ProfitabilityResponse> {
    const cachedResult = cache.get(CACHED_PROFITABILITIES_KEY);
    if (cachedResult) {
      console.log('Returning cached result');
      return {
        opportunities: cachedResult.value,
        fetchedAt: cachedResult.storedAt
      };
    }

    const result = cache.set(CACHED_PROFITABILITIES_KEY, await arbitrageService.getProfitableArbitrages());

    console.log('Returning fresh result');
    return {
      opportunities: result.value,
      fetchedAt: result.storedAt
    };
  }
}