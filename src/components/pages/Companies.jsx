import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"
import { companyService } from "@/services/api/companyService"
import { toast } from "react-toastify"
import { formatRelativeTime } from "@/utils/formatters"

const Companies = () => {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadCompanies = async () => {
    try {
      setLoading(true)
      setError("")
      
      const companiesData = await companyService.getAll()
      
      setCompanies(companiesData)
      setFilteredCompanies(companiesData)
    } catch (err) {
      setError(err.message || "Failed to load companies")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCompanies()
  }, [])

  useEffect(() => {
    let filtered = [...companies]

    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredCompanies(filtered)
  }, [companies, searchTerm])

  const handleDelete = async (company) => {
    if (!confirm(`Are you sure you want to delete ${company.name}?`)) {
      return
    }

    try {
      const success = await companyService.delete(company.Id)
      if (success) {
        toast.success("Company deleted successfully")
        await loadCompanies()
      } else {
        toast.error("Failed to delete company")
      }
    } catch (err) {
      toast.error("Failed to delete company")
    }
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Error message={error} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your company records
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate("/companies/new")}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Company</span>
        </Button>
      </div>

      <div className="card p-4">
        <Input
          placeholder="Search companies by name, website, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon="Search"
        />
      </div>

      {filteredCompanies.length === 0 ? (
        <Empty
          title="No companies found"
          description={searchTerm ? "Try adjusting your search" : "Get started by adding your first company"}
          actionLabel={!searchTerm ? "Add Company" : undefined}
          onAction={!searchTerm ? () => navigate("/companies/new") : undefined}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <div key={company.Id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {company.name}
                  </h3>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                    >
                      <ApperIcon name="ExternalLink" size={12} />
                      <span>Visit website</span>
                    </a>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/companies/${company.Id}/edit`)}
                  >
                    <ApperIcon name="Edit2" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(company)}
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>

              {company.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {company.description}
                </p>
              )}

              {company.tags && company.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {company.tags.slice(0, 3).map((tag, idx) => (
                    <Badge key={idx} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                  {company.tags.length > 3 && (
                    <Badge variant="secondary" size="sm">
                      +{company.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="text-xs text-gray-500 pt-4 border-t border-gray-100">
                Created {formatRelativeTime(company.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Companies