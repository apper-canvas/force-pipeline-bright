import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import CompanyFormComponent from "@/components/organisms/CompanyForm"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { companyService } from "@/services/api/companyService"
import { toast } from "react-toastify"

const CompanyFormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(isEditing)
  const [error, setError] = useState("")

  const loadCompany = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      setError("")
      const companyData = await companyService.getById(id)
      setCompany(companyData)
    } catch (err) {
      setError(err.message || "Failed to load company")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isEditing) {
      loadCompany()
    }
  }, [id, isEditing])

  const handleSave = async (formData) => {
    try {
      let result
      if (isEditing) {
        result = await companyService.update(id, formData)
      } else {
        result = await companyService.create(formData)
      }

      if (result) {
        toast.success(isEditing ? "Company updated successfully!" : "Company created successfully!")
        navigate("/companies")
      } else {
        toast.error("Failed to save company")
      }
    } catch (err) {
      toast.error("An error occurred while saving")
    }
  }

  const handleCancel = () => {
    navigate("/companies")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Error message={error} />
        <Button variant="ghost" onClick={() => navigate("/companies")}>
          Back to Companies
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Edit Company" : "New Company"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEditing ? "Update company information" : "Add a new company to your CRM"}
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          <span>Back</span>
        </Button>
      </div>

      <div className="card p-8">
        <CompanyFormComponent
          company={company}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

export default CompanyFormPage