const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

export const companyService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"name": "Owner"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        pagingInfo: {"limit": 1000, "offset": 0}
      }
      
      const response = await apperClient.fetchRecords('company_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data.map(company => ({
        Id: company.Id,
        name: company.name_c || company.Name || '',
        description: company.description_c || '',
        website: company.website_c || '',
        tags: company.Tags ? company.Tags.split(',').map(t => t.trim()) : [],
        owner: company.Owner?.Name || '',
        createdAt: company.CreatedOn,
        updatedAt: company.ModifiedOn
      }))
    } catch (error) {
      console.error("Error fetching companies:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"name": "Owner"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }
      
      const response = await apperClient.getRecordById('company_c', id, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      const company = response.data
      return {
        Id: company.Id,
        name: company.name_c || company.Name || '',
        description: company.description_c || '',
        website: company.website_c || '',
        tags: company.Tags ? company.Tags.split(',').map(t => t.trim()) : [],
        owner: company.Owner?.Name || '',
        createdAt: company.CreatedOn,
        updatedAt: company.ModifiedOn
      }
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(companyData) {
    try {
      const params = {
        records: [{
          name_c: companyData.name?.trim() || '',
          description_c: companyData.description?.trim() || '',
          website_c: companyData.website?.trim() || ''
        }]
      }
      
      // Only add Tags if provided
      if (companyData.tags && companyData.tags.length > 0) {
        params.records[0].Tags = Array.isArray(companyData.tags) 
          ? companyData.tags.join(',') 
          : companyData.tags
      }
      
      const response = await apperClient.createRecord('company_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to create company:`, result)
          return null
        }
        
        const company = result.data
        return {
          Id: company.Id,
          name: company.name_c || company.Name || '',
          description: company.description_c || '',
          website: company.website_c || '',
          tags: company.Tags ? company.Tags.split(',').map(t => t.trim()) : [],
          owner: company.Owner?.Name || '',
          createdAt: company.CreatedOn,
          updatedAt: company.ModifiedOn
        }
      }
      
      return null
    } catch (error) {
      console.error("Error creating company:", error?.response?.data?.message || error)
      return null
    }
  },

  async update(id, companyData) {
    try {
      const updateData = {
        Id: parseInt(id)
      }
      
      if (companyData.name !== undefined) updateData.name_c = companyData.name.trim()
      if (companyData.description !== undefined) updateData.description_c = companyData.description.trim()
      if (companyData.website !== undefined) updateData.website_c = companyData.website.trim()
      if (companyData.tags !== undefined) {
        updateData.Tags = Array.isArray(companyData.tags) 
          ? companyData.tags.join(',') 
          : companyData.tags
      }
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('company_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to update company:`, result)
          return null
        }
        
        const company = result.data
        return {
          Id: company.Id,
          name: company.name_c || company.Name || '',
          description: company.description_c || '',
          website: company.website_c || '',
          tags: company.Tags ? company.Tags.split(',').map(t => t.trim()) : [],
          owner: company.Owner?.Name || '',
          createdAt: company.CreatedOn,
          updatedAt: company.ModifiedOn
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating company:", error?.response?.data?.message || error)
      return null
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('company_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return false
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to delete company:`, result)
          return false
        }
        return true
      }
      
      return false
    } catch (error) {
      console.error("Error deleting company:", error?.response?.data?.message || error)
      return false
    }
  }
}