import { useState } from "react"
import { cn } from "@/utils/cn"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { toast } from "react-toastify"

const CompanyForm = ({ 
  company, 
  onSave, 
  onCancel,
  className 
}) => {
  const [formData, setFormData] = useState({
    name: company?.name || "",
    description: company?.description || "",
    website: company?.website || "",
    tags: company?.tags?.join(", ") || ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

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
      newErrors.name = "Company name is required"
    }
    
    if (formData.website && formData.website.trim()) {
const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
      if (!urlPattern.test(formData.website.trim())) {
        newErrors.website = "Please enter a valid website URL"
      }
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
      toast.success(company ? "Company updated successfully!" : "Company created successfully!")
    } catch (error) {
      toast.error("Failed to save company. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <div className="space-y-6">
        <Input
          name="name"
          label="Company Name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Enter company name"
          required
        />
        
        <Input
          name="website"
          label="Website"
          value={formData.website}
          onChange={handleChange}
          error={errors.website}
          placeholder="https://example.com"
        />

        <Textarea
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter company description..."
          rows={4}
        />

        <Input
          name="tags"
          label="Tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Enter tags separated by commas (e.g., Technology, Enterprise, Partner)"
        />
      </div>

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
              <span>{company ? "Update Company" : "Create Company"}</span>
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

export default CompanyForm