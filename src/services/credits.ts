import type { AxiosInstance } from 'axios'
import type { ApiResponse,ApiResult } from '../types/api'
import type { CreditBase } from '../types/credits'
import type { Paging } from '../types/paging'
export const createCreditsService = (api: AxiosInstance) => {
  return {
    /**
     * 获取积分历史记录
     * @param page 页码
     * @param size 每页数量
     */
    getCreditHistory: (page: number = 0, size: number = 20)  : ApiResult<Paging<CreditBase>> => {
      return api.get('/credits/history', {
        params: { page, size }
      })
    },

    /**
     * 扣除积分
     * @param credits 扣除的积分数量
     */
    deductCredits: (credits: number) => {
      return api.post<ApiResponse<{ credits: number }>>('/credits/deduct', {
        credits
      })
    }
  }
}

export type CreditsService = ReturnType<typeof createCreditsService> 