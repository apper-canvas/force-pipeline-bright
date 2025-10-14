const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

export const activityService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      }
      
      const response = await apperClient.fetchRecords('activity_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data.map(activity => ({
        Id: activity.Id,
        contactId: activity.contact_id_c?.Id || null,
        dealId: activity.deal_id_c?.Id || null,
        type: activity.type_c || '',
        description: activity.description_c || '',
        timestamp: activity.timestamp_c || new Date().toISOString()
      }))
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}}
        ]
      }
      
      const response = await apperClient.getRecordById('activity_c', id, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      const activity = response.data
      return {
        Id: activity.Id,
        contactId: activity.contact_id_c?.Id || null,
        dealId: activity.deal_id_c?.Id || null,
        type: activity.type_c || '',
        description: activity.description_c || '',
        timestamp: activity.timestamp_c || new Date().toISOString()
      }
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(activityData) {
    try {
      const params = {
        records: [{
          contact_id_c: activityData.contactId ? parseInt(activityData.contactId) : null,
          deal_id_c: activityData.dealId ? parseInt(activityData.dealId) : null,
          type_c: activityData.type || '',
          description_c: activityData.description?.trim() || '',
          timestamp_c: activityData.timestamp || new Date().toISOString()
        }]
      }
      
      const response = await apperClient.createRecord('activity_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to create activity:`, result)
          return null
        }
        
        const activity = result.data
        return {
          Id: activity.Id,
          contactId: activity.contact_id_c?.Id || null,
          dealId: activity.deal_id_c?.Id || null,
          type: activity.type_c || '',
          description: activity.description_c || '',
          timestamp: activity.timestamp_c || new Date().toISOString()
        }
      }
      
      return null
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error)
      return null
    }
  },

  async update(id, activityData) {
    try {
      const updateData = {
        Id: parseInt(id)
      }
      
      if (activityData.contactId !== undefined) updateData.contact_id_c = activityData.contactId ? parseInt(activityData.contactId) : null
      if (activityData.dealId !== undefined) updateData.deal_id_c = activityData.dealId ? parseInt(activityData.dealId) : null
      if (activityData.type !== undefined) updateData.type_c = activityData.type
      if (activityData.description !== undefined) updateData.description_c = activityData.description.trim()
      if (activityData.timestamp !== undefined) updateData.timestamp_c = activityData.timestamp
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('activity_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to update activity:`, result)
          return null
        }
        
        const activity = result.data
        return {
          Id: activity.Id,
          contactId: activity.contact_id_c?.Id || null,
          dealId: activity.deal_id_c?.Id || null,
          type: activity.type_c || '',
          description: activity.description_c || '',
          timestamp: activity.timestamp_c || new Date().toISOString()
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating activity:", error?.response?.data?.message || error)
      return null
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('activity_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return false
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to delete activity:`, result)
          return false
        }
        return true
      }
      
      return false
    } catch (error) {
      console.error("Error deleting activity:", error?.response?.data?.message || error)
      return false
    }
  }
}