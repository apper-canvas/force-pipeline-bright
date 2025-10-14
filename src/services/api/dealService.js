const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

export const dealService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "close_date_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        pagingInfo: {"limit": 1000, "offset": 0}
      }
      
      const response = await apperClient.fetchRecords('deal_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data.map(deal => ({
        Id: deal.Id,
        title: deal.title_c || '',
        value: deal.value_c || 0,
        stage: deal.stage_c || '',
        contactId: deal.contact_id_c?.Id || null,
        closeDate: deal.close_date_c || null,
        probability: deal.probability_c || 50,
        notes: deal.notes_c || '',
        createdAt: deal.CreatedOn,
        updatedAt: deal.ModifiedOn
      }))
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "close_date_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }
      
      const response = await apperClient.getRecordById('deal_c', id, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      const deal = response.data
      return {
        Id: deal.Id,
        title: deal.title_c || '',
        value: deal.value_c || 0,
        stage: deal.stage_c || '',
        contactId: deal.contact_id_c?.Id || null,
        closeDate: deal.close_date_c || null,
        probability: deal.probability_c || 50,
        notes: deal.notes_c || '',
        createdAt: deal.CreatedOn,
        updatedAt: deal.ModifiedOn
      }
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(dealData) {
    try {
      const params = {
        records: [{
          title_c: dealData.title?.trim() || '',
          value_c: parseFloat(dealData.value) || 0,
          stage_c: dealData.stage || '',
          contact_id_c: dealData.contactId ? parseInt(dealData.contactId) : null,
          close_date_c: dealData.closeDate || null,
          probability_c: parseInt(dealData.probability) || 50,
          notes_c: dealData.notes?.trim() || ''
        }]
      }
      
      const response = await apperClient.createRecord('deal_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to create deal:`, result)
          return null
        }
        
        const deal = result.data
        return {
          Id: deal.Id,
          title: deal.title_c || '',
          value: deal.value_c || 0,
          stage: deal.stage_c || '',
          contactId: deal.contact_id_c?.Id || null,
          closeDate: deal.close_date_c || null,
          probability: deal.probability_c || 50,
          notes: deal.notes_c || '',
          createdAt: deal.CreatedOn,
          updatedAt: deal.ModifiedOn
        }
      }
      
      return null
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error)
      return null
    }
  },

  async update(id, dealData) {
    try {
      const updateData = {
        Id: parseInt(id)
      }
      
      if (dealData.title !== undefined) updateData.title_c = dealData.title.trim()
      if (dealData.value !== undefined) updateData.value_c = parseFloat(dealData.value)
      if (dealData.stage !== undefined) updateData.stage_c = dealData.stage
      if (dealData.contactId !== undefined) updateData.contact_id_c = dealData.contactId ? parseInt(dealData.contactId) : null
      if (dealData.closeDate !== undefined) updateData.close_date_c = dealData.closeDate
      if (dealData.probability !== undefined) updateData.probability_c = parseInt(dealData.probability)
      if (dealData.notes !== undefined) updateData.notes_c = dealData.notes.trim()
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('deal_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to update deal:`, result)
          return null
        }
        
        const deal = result.data
        return {
          Id: deal.Id,
          title: deal.title_c || '',
          value: deal.value_c || 0,
          stage: deal.stage_c || '',
          contactId: deal.contact_id_c?.Id || null,
          closeDate: deal.close_date_c || null,
          probability: deal.probability_c || 50,
          notes: deal.notes_c || '',
          createdAt: deal.CreatedOn,
          updatedAt: deal.ModifiedOn
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error)
      return null
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('deal_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return false
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to delete deal:`, result)
          return false
        }
        return true
      }
      
      return false
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error)
      return false
    }
  },

  async updateStage(id, stage) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          stage_c: stage
        }]
      }
      
      const response = await apperClient.updateRecord('deal_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to update deal stage:`, result)
          return null
        }
        
        const deal = result.data
        return {
          Id: deal.Id,
          title: deal.title_c || '',
          value: deal.value_c || 0,
          stage: deal.stage_c || '',
          contactId: deal.contact_id_c?.Id || null,
          closeDate: deal.close_date_c || null,
          probability: deal.probability_c || 50,
          notes: deal.notes_c || '',
          createdAt: deal.CreatedOn,
          updatedAt: deal.ModifiedOn
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating deal stage:", error?.response?.data?.message || error)
      return null
    }
  }
}