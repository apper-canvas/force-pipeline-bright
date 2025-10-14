const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

export const contactService = {
async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"name": "company_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        pagingInfo: {"limit": 1000, "offset": 0}
      }
      
      const response = await apperClient.fetchRecords('contact_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data.map(contact => ({
        Id: contact.Id,
        name: contact.name_c || '',
        company: contact.company_id_c?.Name || '',
        companyId: contact.company_id_c?.Id || null,
        email: contact.email_c || '',
        phone: contact.phone_c || '',
        tags: contact.tags_c ? contact.tags_c.split(',').map(t => t.trim()) : [],
        notes: contact.notes_c || '',
        createdAt: contact.CreatedOn,
        updatedAt: contact.ModifiedOn
      }))
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error)
      return []
    }
  },

async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"name": "company_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }
      
      const response = await apperClient.getRecordById('contact_c', id, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      const contact = response.data
      return {
        Id: contact.Id,
        name: contact.name_c || '',
        company: contact.company_id_c?.Name || '',
        companyId: contact.company_id_c?.Id || null,
        email: contact.email_c || '',
        phone: contact.phone_c || '',
        tags: contact.tags_c ? contact.tags_c.split(',').map(t => t.trim()) : [],
        notes: contact.notes_c || '',
        createdAt: contact.CreatedOn,
        updatedAt: contact.ModifiedOn
      }
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

async create(contactData) {
    try {
      const recordData = {
        name_c: contactData.name?.trim() || '',
        email_c: contactData.email?.trim() || '',
        phone_c: contactData.phone?.trim() || '',
        tags_c: Array.isArray(contactData.tags) ? contactData.tags.join(',') : (contactData.tags || ''),
        notes_c: contactData.notes?.trim() || ''
      }
      
      // Only add company_id_c if companyId is provided
      if (contactData.companyId) {
        recordData.company_id_c = parseInt(contactData.companyId)
      }
      
      const params = {
        records: [recordData]
      }
      
      const response = await apperClient.createRecord('contact_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to create contact:`, result)
          return null
        }
        
        const contact = result.data
        return {
          Id: contact.Id,
          name: contact.name_c || '',
          company: contact.company_id_c?.Name || '',
          companyId: contact.company_id_c?.Id || null,
          email: contact.email_c || '',
          phone: contact.phone_c || '',
          tags: contact.tags_c ? contact.tags_c.split(',').map(t => t.trim()) : [],
          notes: contact.notes_c || '',
          createdAt: contact.CreatedOn,
          updatedAt: contact.ModifiedOn
        }
      }
      
      return null
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error)
      return null
    }
  },

async update(id, contactData) {
    try {
      const updateData = {
        Id: parseInt(id)
      }
      
      if (contactData.name !== undefined) updateData.name_c = contactData.name.trim()
      if (contactData.companyId !== undefined) {
        if (contactData.companyId) {
          updateData.company_id_c = parseInt(contactData.companyId)
        } else {
          updateData.company_id_c = null
        }
      }
      if (contactData.email !== undefined) updateData.email_c = contactData.email.trim()
      if (contactData.phone !== undefined) updateData.phone_c = contactData.phone.trim()
      if (contactData.tags !== undefined) {
        updateData.tags_c = Array.isArray(contactData.tags) 
          ? contactData.tags.join(',') 
          : contactData.tags
      }
      if (contactData.notes !== undefined) updateData.notes_c = contactData.notes.trim()
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('contact_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to update contact:`, result)
          return null
        }
        
        const contact = result.data
        return {
          Id: contact.Id,
          name: contact.name_c || '',
          company: contact.company_id_c?.Name || '',
          companyId: contact.company_id_c?.Id || null,
          email: contact.email_c || '',
          phone: contact.phone_c || '',
          tags: contact.tags_c ? contact.tags_c.split(',').map(t => t.trim()) : [],
          notes: contact.notes_c || '',
          createdAt: contact.CreatedOn,
          updatedAt: contact.ModifiedOn
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error)
      return null
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('contact_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return false
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to delete contact:`, result)
          return false
        }
        return true
      }
      
      return false
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error)
      return false
    }
  }
}