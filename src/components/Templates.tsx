import React, { useState } from 'react';
import { Search, Filter, Star, Eye, Download, ArrowRight, Palette, Layout, Briefcase, GraduationCap, Code, Heart, Crown, Zap, FileText } from 'lucide-react';

type View = 'home' | 'dashboard' | 'builder' | 'analyzer' | 'templates' | 'pricing' | 'settings';

interface TemplatesProps {
  onNavigate: (view: View) => void;
}

interface Template {
  id: string;
  name: string;
  category: string;
  style: string;
  industry: string;
  level: string;
  rating: number;
  downloads: number;
  isPremium: boolean;
  image: string;
  description: string;
  features: string[];
  colors: string[];
  layout: string;
  hasPhoto: boolean;
}

const Templates: React.FC<TemplatesProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const templates: Template[] = [
    {
      id: '1',
      name: 'Modern Professional',
      category: 'Professional',
      style: 'Modern',
      industry: 'Technology',
      level: 'Senior',
      rating: 4.9,
      downloads: 12560,
      isPremium: false,
      image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Clean, modern design perfect for tech professionals',
      features: ['ATS-Optimized', '2-Page Layout', 'Custom Sections', 'Modern Typography'],
      colors: ['Blue', 'Gray', 'White'],
      layout: 'Single Column',
      hasPhoto: true
    },
    {
      id: '2',
      name: 'Executive Elite',
      category: 'Executive',
      style: 'Professional',
      industry: 'Business',
      level: 'Executive',
      rating: 4.8,
      downloads: 8945,
      isPremium: true,
      image: 'https://images.pexels.com/photos/3803517/pexels-photo-3803517.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Sophisticated template for C-level executives',
      features: ['Premium Design', 'Executive Format', 'Custom Branding', 'Elegant Layout'],
      colors: ['Navy', 'Gold', 'White'],
      layout: 'Two Column',
      hasPhoto: true
    },
    {
      id: '3',
      name: 'Creative Portfolio',
      category: 'Creative',
      style: 'Creative',
      industry: 'Design',
      level: 'Mid-Level',
      rating: 4.7,
      downloads: 15230,
      isPremium: true,
      image: 'https://images.pexels.com/photos/3803517/pexels-photo-3803517.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Stand out with this creative design template',
      features: ['Portfolio Section', 'Color Customization', 'Creative Layout', 'Visual Elements'],
      colors: ['Purple', 'Pink', 'White'],
      layout: 'Creative Grid',
      hasPhoto: true
    },
    {
      id: '4',
      name: 'Academic Scholar',
      category: 'Academic',
      style: 'Traditional',
      industry: 'Education',
      level: 'Entry-Level',
      rating: 4.6,
      downloads: 6789,
      isPremium: false,
      image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Traditional format ideal for academic positions',
      features: ['Academic Format', 'Publication List', 'Research Focus', 'Clean Design'],
      colors: ['Black', 'White'],
      layout: 'Traditional',
      hasPhoto: false
    },
    {
      id: '5',
      name: 'Startup Ready',
      category: 'Modern',
      style: 'Modern',
      industry: 'Startup',
      level: 'Mid-Level',
      rating: 4.8,
      downloads: 9876,
      isPremium: false,
      image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Dynamic template for startup environments',
      features: ['Startup Friendly', 'Skills Highlight', 'Project Showcase', 'Modern Design'],
      colors: ['Green', 'Blue', 'White'],
      layout: 'Modern Split',
      hasPhoto: false
    },
    {
      id: '6',
      name: 'Healthcare Pro',
      category: 'Professional',
      style: 'Professional',
      industry: 'Healthcare',
      level: 'Senior',
      rating: 4.9,
      downloads: 7654,
      isPremium: true,
      image: 'https://images.pexels.com/photos/3803517/pexels-photo-3803517.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Professional template for healthcare professionals',
      features: ['Medical Format', 'Certifications', 'Professional Design', 'ATS-Optimized'],
      colors: ['Teal', 'White', 'Gray'],
      layout: 'Professional',
      hasPhoto: false
    },
    {
      id: '7',
      name: 'Minimalist Elegance',
      category: 'Minimalist',
      style: 'Minimalist',
      industry: 'Any',
      level: 'Any',
      rating: 4.7,
      downloads: 11234,
      isPremium: false,
      image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Clean and elegant minimalist design',
      features: ['Minimalist Design', 'Clean Typography', 'Spacious Layout', 'No Photo Required'],
      colors: ['Black', 'White'],
      layout: 'Minimalist',
      hasPhoto: false
    },
    {
      id: '8',
      name: 'Bold Impact',
      category: 'Creative',
      style: 'Bold',
      industry: 'Marketing',
      level: 'Mid-Level',
      rating: 4.6,
      downloads: 8765,
      isPremium: true,
      image: 'https://images.pexels.com/photos/3803517/pexels-photo-3803517.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Make a bold statement with vibrant colors',
      features: ['Bold Colors', 'Impact Design', 'Creative Sections', 'No Photo Required'],
      colors: ['Orange', 'Red', 'White'],
      layout: 'Bold Grid',
      hasPhoto: false
    },
    {
      id: '9',
      name: 'Tech Innovator',
      category: 'Modern',
      style: 'Tech',
      industry: 'Technology',
      level: 'Senior',
      rating: 4.8,
      downloads: 13456,
      isPremium: true,
      image: 'https://images.pexels.com/photos/3803517/pexels-photo-3803517.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Cutting-edge design for tech professionals',
      features: ['Tech-Focused', 'Skills Matrix', 'Project Timeline', 'Modern Icons'],
      colors: ['Blue', 'Cyan', 'Dark'],
      layout: 'Tech Grid',
      hasPhoto: false
    },
    {
      id: '10',
      name: 'Corporate Classic',
      category: 'Professional',
      style: 'Traditional',
      industry: 'Finance',
      level: 'Senior',
      rating: 4.5,
      downloads: 5432,
      isPremium: false,
      image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Traditional corporate design for finance professionals',
      features: ['Conservative Design', 'Professional Layout', 'ATS-Friendly', 'No Photo Required'],
      colors: ['Navy', 'White', 'Gray'],
      layout: 'Traditional',
      hasPhoto: false
    },
    {
      id: '11',
      name: 'Sales Champion',
      category: 'Professional',
      style: 'Modern',
      industry: 'Sales',
      level: 'Mid-Level',
      rating: 4.7,
      downloads: 7890,
      isPremium: false,
      image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Results-focused template for sales professionals',
      features: ['Achievement Focus', 'Metrics Highlight', 'Clean Design', 'No Photo Required'],
      colors: ['Green', 'White', 'Gray'],
      layout: 'Single Column',
      hasPhoto: false
    },
    {
      id: '12',
      name: 'Engineering Excellence',
      category: 'Technical',
      style: 'Modern',
      industry: 'Engineering',
      level: 'Senior',
      rating: 4.8,
      downloads: 9123,
      isPremium: false,
      image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Technical template for engineering professionals',
      features: ['Technical Focus', 'Project Showcase', 'Skills Matrix', 'No Photo Required'],
      colors: ['Blue', 'Gray', 'White'],
      layout: 'Two Column',
      hasPhoto: false
    },
    {
      id: '13',
      name: 'Legal Professional',
      category: 'Professional',
      style: 'Traditional',
      industry: 'Legal',
      level: 'Senior',
      rating: 4.6,
      downloads: 4567,
      isPremium: true,
      image: 'https://images.pexels.com/photos/3803517/pexels-photo-3803517.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Conservative template for legal professionals',
      features: ['Traditional Format', 'Professional Design', 'Case Highlights', 'No Photo Required'],
      colors: ['Black', 'White', 'Gold'],
      layout: 'Traditional',
      hasPhoto: false
    },
    {
      id: '14',
      name: 'Consultant Pro',
      category: 'Professional',
      style: 'Modern',
      industry: 'Consulting',
      level: 'Senior',
      rating: 4.9,
      downloads: 8901,
      isPremium: true,
      image: 'https://images.pexels.com/photos/3803517/pexels-photo-3803517.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Strategic template for consulting professionals',
      features: ['Strategic Focus', 'Client Results', 'Modern Design', 'No Photo Required'],
      colors: ['Purple', 'White', 'Gray'],
      layout: 'Modern Split',
      hasPhoto: false
    },
    {
      id: '15',
      name: 'Data Scientist',
      category: 'Technical',
      style: 'Modern',
      industry: 'Data Science',
      level: 'Mid-Level',
      rating: 4.8,
      downloads: 10234,
      isPremium: false,
      image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Analytics-focused template for data professionals',
      features: ['Data Visualization', 'Technical Skills', 'Project Portfolio', 'No Photo Required'],
      colors: ['Teal', 'Blue', 'White'],
      layout: 'Tech Grid',
      hasPhoto: false
    },
    {
      id: '16',
      name: 'Non-Profit Leader',
      category: 'Professional',
      style: 'Modern',
      industry: 'Non-Profit',
      level: 'Senior',
      rating: 4.7,
      downloads: 3456,
      isPremium: false,
      image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Mission-driven template for non-profit professionals',
      features: ['Impact Focus', 'Community Work', 'Clean Design', 'No Photo Required'],
      colors: ['Green', 'White', 'Gray'],
      layout: 'Single Column',
      hasPhoto: false
    },
    {
      id: '17',
      name: 'Fresh Graduate',
      category: 'Entry-Level',
      style: 'Modern',
      industry: 'Any',
      level: 'Entry-Level',
      rating: 4.5,
      downloads: 15678,
      isPremium: false,
      image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Perfect template for recent graduates',
      features: ['Education Focus', 'Internship Highlight', 'Skills Emphasis', 'No Photo Required'],
      colors: ['Blue', 'White', 'Gray'],
      layout: 'Single Column',
      hasPhoto: false
    },
    {
      id: '18',
      name: 'Project Manager',
      category: 'Professional',
      style: 'Modern',
      industry: 'Management',
      level: 'Senior',
      rating: 4.8,
      downloads: 7234,
      isPremium: false,
      image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Leadership-focused template for project managers',
      features: ['Leadership Focus', 'Project Highlights', 'Team Management', 'No Photo Required'],
      colors: ['Orange', 'White', 'Gray'],
      layout: 'Two Column',
      hasPhoto: false
    }
  ];

  const categories = ['all', 'Professional', 'Creative', 'Executive', 'Academic', 'Modern', 'Minimalist', 'Technical', 'Entry-Level'];
  const styles = ['all', 'Modern', 'Professional', 'Creative', 'Traditional', 'Minimalist', 'Bold', 'Tech'];
  const industries = ['all', 'Technology', 'Business', 'Design', 'Education', 'Startup', 'Healthcare', 'Marketing', 'Finance', 'Sales', 'Engineering', 'Legal', 'Consulting', 'Data Science', 'Non-Profit', 'Management', 'Any'];
  const levels = ['all', 'Entry-Level', 'Mid-Level', 'Senior', 'Executive', 'Any'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesStyle = selectedStyle === 'all' || template.style === selectedStyle;
    const matchesIndustry = selectedIndustry === 'all' || template.industry === selectedIndustry;
    const matchesLevel = selectedLevel === 'all' || template.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesStyle && matchesIndustry && matchesLevel;
  });

  const handleUseTemplate = (templateId: string) => {
    // In a real app, this would load the template into the builder
    onNavigate('builder');
  };

  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case 'Single Column': return Layout;
      case 'Two Column': return Layout;
      case 'Creative Grid': return Palette;
      case 'Traditional': return FileText;
      case 'Modern Split': return Layout;
      case 'Professional': return Briefcase;
      case 'Minimalist': return Layout;
      case 'Bold Grid': return Zap;
      case 'Tech Grid': return Code;
      default: return Layout;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Templates</h1>
        <p className="text-gray-600">Choose from our collection of professionally designed, ATS-optimized templates. Many templates available without photo requirements.</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {styles.map(style => (
                    <option key={style} value={style}>
                      {style === 'all' ? 'All Styles' : style}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>
                      {industry === 'all' ? 'All Industries' : industry}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>
                      {level === 'all' ? 'All Levels' : level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredTemplates.length} of {templates.length} templates
          <span className="ml-2 text-sm text-blue-600">
            ({filteredTemplates.filter(t => !t.hasPhoto).length} without photo requirement)
          </span>
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map(template => {
          const LayoutIcon = getLayoutIcon(template.layout);
          return (
            <div key={template.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow group">
              {/* Template Preview */}
              <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                <img 
                  src={template.image}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Premium Badge */}
                {template.isPremium && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <Crown className="w-3 h-3" />
                    <span>Premium</span>
                  </div>
                )}

                {/* No Photo Badge */}
                {!template.hasPhoto && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    No Photo Required
                  </div>
                )}

                {/* Layout Badge */}
                <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <LayoutIcon className="w-3 h-3" />
                  <span>{template.layout}</span>
                </div>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                  <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <button 
                    onClick={() => handleUseTemplate(template.id)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center space-x-2"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{template.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{template.description}</p>

                {/* Color Palette */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xs font-medium text-gray-500">Colors:</span>
                  <div className="flex space-x-1">
                    {template.colors.map((color, index) => (
                      <div
                        key={index}
                        className={`w-4 h-4 rounded-full border border-gray-300 ${
                          color === 'Blue' ? 'bg-blue-500' :
                          color === 'Gray' ? 'bg-gray-500' :
                          color === 'White' ? 'bg-white' :
                          color === 'Navy' ? 'bg-blue-900' :
                          color === 'Gold' ? 'bg-yellow-500' :
                          color === 'Purple' ? 'bg-purple-500' :
                          color === 'Pink' ? 'bg-pink-500' :
                          color === 'Black' ? 'bg-black' :
                          color === 'Green' ? 'bg-green-500' :
                          color === 'Teal' ? 'bg-teal-500' :
                          color === 'Orange' ? 'bg-orange-500' :
                          color === 'Red' ? 'bg-red-500' :
                          color === 'Cyan' ? 'bg-cyan-500' :
                          color === 'Dark' ? 'bg-gray-800' :
                          'bg-gray-300'
                        }`}
                        title={color}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {template.style}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {template.industry}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {template.level}
                  </span>
                  {!template.hasPhoto && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                      No Photo
                    </span>
                  )}
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {template.features.slice(0, 2).map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>{template.downloads.toLocaleString()} downloads</span>
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  onClick={() => handleUseTemplate(template.id)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center space-x-2"
                >
                  <span>Use This Template</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedStyle('all');
              setSelectedIndustry('all');
              setSelectedLevel('all');
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Can't find the perfect template?</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Our resume builder allows you to customize any template or start from scratch with complete creative control. Many templates work perfectly without photos.
        </p>
        <button 
          onClick={() => onNavigate('builder')}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Start Building
        </button>
      </div>
    </div>
  );
};

export default Templates;