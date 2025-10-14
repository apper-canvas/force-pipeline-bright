import React, { useEffect, useState } from "react";
import { companyService } from "@/services/api/companyService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";

const ContactForm = ({
  contact, 
  onSave, 
  onCancel,
  className 
}) => {
  const [companies, setCompanies] = useState([])
  const [companiesLoading, setCompaniesLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: contact?.name || "",
    companyId: contact?.companyId || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
    notes: contact?.notes || "",
    tags: contact?.tags?.join(", ") || ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const loadCompanies = async () => {
    try {
      setCompaniesLoading(true)
      const companiesData = await companyService.getAll()
      setCompanies(companiesData)
    } catch (error) {
      console.error("Error loading companies:", error)
      toast.error("Failed to load companies")
    } finally {
      setCompaniesLoading(false)
    }
  }

  useEffect(() => {
    loadCompanies()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    
    if (!formData.companyId) {
      newErrors.companyId = "Company is required"
    }
    
if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (formData.phone && !/^[\d\s\-+().]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const submitData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
      }
      
      await onSave?.(submitData)
      toast.success(contact ? "Contact updated successfully!" : "Contact created successfully!")
    } catch (error) {
      toast.error("Failed to save contact. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          name="name"
          label="Full Name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Enter full name"
          required
        />
        
        <Select
          name="companyId"
          label="Company"
          value={formData.companyId}
          onChange={handleChange}
          error={errors.companyId}
          disabled={companiesLoading}
          required
          options={[
            { value: "", label: companiesLoading ? "Loading companies..." : "Select a company" },
            ...companies.map(company => ({
              value: company.Id.toString(),
              label: company.name
            }))
          ]}
        />
        <Input
          name="email"
          type="email"
          label="Email Address"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Enter email address"
          required
        />
        
        <Input
          name="phone"
          label="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="Enter phone number"
        />
      </div>

      <Input
        name="tags"
        label="Tags"
        value={formData.tags}
        onChange={handleChange}
        placeholder="Enter tags separated by commas (e.g., VIP, Prospect, Enterprise)"
      />

      <Textarea
        name="notes"
        label="Notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Add any additional notes about this contact..."
        rows={4}
      />

      <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <ApperIcon name="Loader2" size={16} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <ApperIcon name="Check" size={16} />
              <span>{contact ? "Update Contact" : "Create Contact"}</span>
            </>
          )}
        </Button>
        
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export default ContactForm