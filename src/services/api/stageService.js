const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

export const stageService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "color_c"}}
        ],
        orderBy: [{"fieldName": "order_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }
      
      const response = await apperClient.fetchRecords('stage_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data.map(stage => ({
        Id: stage.Id,
        name: stage.name_c || '',
        order: stage.order_c || 0,
        color: stage.color_c || '#6B7280'
      }))
    } catch (error) {
      console.error("Error fetching stages:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "color_c"}}
        ]
      }
      
      const response = await apperClient.getRecordById('stage_c', id, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      const stage = response.data
      return {
        Id: stage.Id,
        name: stage.name_c || '',
        order: stage.order_c || 0,
        color: stage.color_c || '#6B7280'
      }
    } catch (error) {
      console.error(`Error fetching stage ${id}:`, error?.response?.data?.message || error)
      return null
    }
  }
}