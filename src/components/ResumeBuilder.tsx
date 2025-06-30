import React, { useState, useRef, useEffect } from 'react';
import { Save, Download, Eye, Plus, Trash2, Upload, Camera, X, FileText, User, Briefcase, GraduationCap, Award, Code, Heart, Globe, MapPin, Phone, Mail, Linkedin, ExternalLink, Calendar, Building, Star, Zap, Target, Sparkles, Brain, Loader2, Palette } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { PDFGenerator } from '../lib/pdfGenerator';
import { GeminiService } from '../lib/gemini';

type View = 'home' | 'dashboard' | 'builder' | 'analyzer' | 'templates' | 'pricing' | 'settings';

interface ResumeBuilderProps {
  onNavigate: (view: View) => void;
}

interface ResumeSection {
  id: string;
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages' | 'interests' | 'custom';
  title: string;
  content: any;
  isVisible: boolean;
  order: number;
}

interface Template {
  id: string;
  name: string;
  preview: string;
  supportsPhoto: boolean;
  style: 'modern' | 'professional' | 'creative';
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [currentTemplate, setCurrentTemplate] = useState<Template>({
    id: 'modern-professional',
    name: 'Modern Professional',
    preview: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
    supportsPhoto: true,
    style: 'modern'
  });
  
  const [sections, setSections] = useState<ResumeSection[]>([
    {
      id: 'header',
      type: 'header',
      title: 'Personal Information',
      content: {
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: '',
        photo: null
      },
      isVisible: true,
      order: 0
    },
    {
      id: 'summary',
      type: 'summary',
      title: 'Professional Summary',
      content: { text: '' },
      isVisible: true,
      order: 1
    },
    {
      id: 'experience',
      type: 'experience',
      title: 'Work Experience',
      content: { items: [] },
      isVisible: true,
      order: 2
    },
    {
      id: 'education',
      type: 'education',
      title: 'Education',
      content: { items: [] },
      isVisible: true,
      order: 3
    },
    {
      id: 'skills',
      type: 'skills',
      title: 'Skills',
      content: { items: [] },
      isVisible: true,
      order: 4
    },
    {
      id: 'projects',
      type: 'projects',
      title: 'Projects',
      content: { items: [] },
      isVisible: true,
      order: 5
    }
  ]);

  const [activeSection, setActiveSection] = useState('header');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('My Resume');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const geminiService = new GeminiService();

  const templates: Template[] = [
    {
      id: 'modern-professional',
      name: 'Modern Professional',
      preview: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
      supportsPhoto: true,
      style: 'modern'
    },
    {
      id: 'creative-portfolio',
      name: 'Creative Portfolio',
      preview: 'https://images.pexels.com/photos/3803517/pexels-photo-3803517.jpeg?auto=compress&cs=tinysrgb&w=400',
      supportsPhoto: true,
      style: 'creative'
    },
    {
      id: 'executive-elite',
      name: 'Executive Elite',
      preview: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
      supportsPhoto: true,
      style: 'professional'
    },
    {
      id: 'minimalist-clean',
      name: 'Minimalist Clean',
      preview: 'https://images.pexels.com/photos/3803517/pexels-photo-3803517.jpeg?auto=compress&cs=tinysrgb&w=400',
      supportsPhoto: false,
      style: 'modern'
    }
  ];

  const availableSectionTypes = [
    { type: 'certifications', title: 'Certifications', icon: Award },
    { type: 'languages', title: 'Languages', icon: Globe },
    { type: 'interests', title: 'Interests', icon: Heart },
    { type: 'custom', title: 'Custom Section', icon: Plus }
  ];

  const updateSection = (sectionId: string, content: any) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId ? { ...section, content } : section
    ));
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId ? { ...section, title } : section
    ));
  };

  const addSection = (type: string) => {
    const newSection: ResumeSection = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      title: type === 'custom' ? 'Custom Section' : availableSectionTypes.find(t => t.type === type)?.title || type,
      content: getDefaultContent(type),
      isVisible: true,
      order: sections.length
    };
    setSections(prev => [...prev, newSection]);
  };

  const removeSection = (sectionId: string) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'certifications':
        return { items: [] };
      case 'languages':
        return { items: [] };
      case 'interests':
        return { items: [] };
      case 'custom':
        return { text: '' };
      default:
        return { items: [] };
    }
  };

  const addItem = (sectionId: string, itemType: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const newItem = getNewItem(itemType);
    const updatedContent = {
      ...section.content,
      items: [...(section.content.items || []), newItem]
    };
    updateSection(sectionId, updatedContent);
  };

  const getNewItem = (type: string) => {
    const id = Date.now().toString();
    switch (type) {
      case 'experience':
        return { id, company: '', position: '', duration: '', description: '', location: '' };
      case 'education':
        return { id, institution: '', degree: '', year: '', gpa: '', location: '' };
      case 'skills':
        return { id, category: '', items: [] };
      case 'projects':
        return { id, name: '', description: '', technologies: '', link: '', duration: '' };
      case 'certifications':
        return { id, name: '', issuer: '', date: '', link: '' };
      case 'languages':
        return { id, language: '', proficiency: 'Intermediate' };
      case 'interests':
        return { id, interest: '' };
      default:
        return { id };
    }
  };

  const updateItem = (sectionId: string, itemId: string, field: string, value: any) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const updatedItems = section.content.items.map((item: any) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updateSection(sectionId, { ...section.content, items: updatedItems });
  };

  const removeItem = (sectionId: string, itemId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const updatedItems = section.content.items.filter((item: any) => item.id !== itemId);
    updateSection(sectionId, { ...section.content, items: updatedItems });
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `resume-photo-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          cacheControl: '3600',
          upsert: false 
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        const headerSection = sections.find(s => s.type === 'header');
        if (headerSection) {
          updateSection('header', {
            ...headerSection.content,
            photo: data.publicUrl
          });
        }
      }
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    }
  };

  const removePhoto = () => {
    const headerSection = sections.find(s => s.type === 'header');
    if (headerSection) {
      updateSection('header', {
        ...headerSection.content,
        photo: null
      });
    }
  };

  const generateAIContent = async (sectionType: string, context: string = '') => {
    setIsGenerating(true);
    try {
      const content = await geminiService.generateResumeContent(sectionType, context);
      
      // Apply the generated content based on section type
      const section = sections.find(s => s.type === sectionType);
      if (section) {
        if (sectionType === 'summary') {
          updateSection(section.id, { text: content });
        } else {
          // For other sections, you might want to parse the content differently
          updateSection(section.id, { text: content });
        }
      }
    } catch (error: any) {
      alert(error.message || 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveResume = async () => {
    if (!user) {
      alert('Please sign in to save your resume');
      return;
    }

    setIsSaving(true);
    try {
      const resumeData = {
        user_id: user.id,
        title: resumeTitle,
        personal_info: sections.find(s => s.type === 'header')?.content || {},
        summary: sections.find(s => s.type === 'summary')?.content?.text || '',
        experience: sections.find(s => s.type === 'experience')?.content?.items || [],
        education: sections.find(s => s.type === 'education')?.content?.items || [],
        skills: sections.find(s => s.type === 'skills')?.content?.items || [],
        projects: sections.find(s => s.type === 'projects')?.content?.items || [],
        is_published: true
      };

      const { error } = await supabase
        .from('resumes')
        .insert(resumeData);

      if (error) throw error;

      alert('Resume saved successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadPDF = async () => {
    if (!resumePreviewRef.current) return;

    try {
      await PDFGenerator.generateResumePDF(resumePreviewRef.current, `${resumeTitle}.pdf`);
    } catch (error) {
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const renderSectionEditor = (section: ResumeSection) => {
    switch (section.type) {
      case 'header':
        return (
          <div className="space-y-4">
            {/* Photo Upload for supported templates */}
            {currentTemplate.supportsPhoto && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Profile Photo</label>
                <div className="flex items-center space-x-4">
                  {section.content.photo ? (
                    <div className="relative">
                      <img 
                        src={section.content.photo} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                      />
                      <button
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Upload Photo</span>
                    </button>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG, WebP, or GIF up to 5MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={section.content.name || ''}
                onChange={(e) => updateSection(section.id, { ...section.content, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Professional Title"
                value={section.content.title || ''}
                onChange={(e) => updateSection(section.id, { ...section.content, title: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email"
                value={section.content.email || ''}
                onChange={(e) => updateSection(section.id, { ...section.content, email: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={section.content.phone || ''}
                onChange={(e) => updateSection(section.id, { ...section.content, phone: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Location"
                value={section.content.location || ''}
                onChange={(e) => updateSection(section.id, { ...section.content, location: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="url"
                placeholder="LinkedIn URL"
                value={section.content.linkedin || ''}
                onChange={(e) => updateSection(section.id, { ...section.content, linkedin: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="url"
                placeholder="Website URL"
                value={section.content.website || ''}
                onChange={(e) => updateSection(section.id, { ...section.content, website: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
              />
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
              <button
                onClick={() => generateAIContent('summary', 'professional summary')}
                disabled={isGenerating}
                className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 text-sm disabled:opacity-50"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>AI Generate</span>
              </button>
            </div>
            <textarea
              placeholder="Write a compelling professional summary that highlights your key achievements and skills..."
              value={section.content.text || ''}
              onChange={(e) => updateSection(section.id, { text: e.target.value })}
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
              <button
                onClick={() => addItem(section.id, 'experience')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Experience</span>
              </button>
            </div>
            {section.content.items?.map((item: any) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Experience Entry</h4>
                  <button
                    onClick={() => removeItem(section.id, item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={item.company || ''}
                    onChange={(e) => updateItem(section.id, item.id, 'company', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Position Title"
                    value={item.position || ''}
                    onChange={(e) => updateItem(section.id, item.id, 'position', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 2020-2023)"
                    value={item.duration || ''}
                    onChange={(e) => updateItem(section.id, item.id, 'duration', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={item.location || ''}
                    onChange={(e) => updateItem(section.id, item.id, 'location', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <textarea
                  placeholder="Job description, key responsibilities, and achievements..."
                  value={item.description || ''}
                  onChange={(e) => updateItem(section.id, item.id, 'description', e.target.value)}
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            ))}
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Education</h3>
              <button
                onClick={() => addItem(section.id, 'education')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Education</span>
              </button>
            </div>
            {section.content.items?.map((item: any) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Education Entry</h4>
                  <button
                    onClick={() => removeItem(section.id, item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Institution Name"
                    value={item.institution || ''}
                    onChange={(e) => updateItem(section.id, item.id, 'institution', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Degree"
                    value={item.degree || ''}
                    onChange={(e) => updateItem(section.id, item.id, 'degree', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Graduation Year"
                    value={item.year || ''}
                    onChange={(e) => updateItem(section.id, item.id, 'year', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="GPA (Optional)"
                    value={item.gpa || ''}
                    onChange={(e) => updateItem(section.id, item.id, 'gpa', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={item.location || ''}
                    onChange={(e) => updateItem(section.id, item.id, 'location', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
              <button
                onClick={() => addItem(section.id, 'skills')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>
            {section.content.items?.map((item: any) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Skill Category</h4>
                  <button
                    onClick={() => removeItem(section.id, item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Category (e.g., Technical Skills)"
                    value={item.category || ''}
                    onChange={(e) => updateItem(section.id, item.id, 'category', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Skills (comma-separated)"
                    value={Array.isArray(item.items) ? item.items.join(', ') : ''}
                    onChange={(e) => updateItem(section.id, item.id, 'items', e.target.value.split(',').map((s: string) => s.trim()))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
              <button
                onClick={() => addItem(section.id, 'projects')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>
            {section.content.items?.map((item: any) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Project Entry</h4>
                  <button
                    onClick={() => removeItem(section.id, item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={item.name || ''}
                    onChange={(e) => updateItem(section.id, item.id, 'name', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={item.duration || ''}
                    onChange={(e) => updateItem(section.id, item.id, 'duration', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Technologies Used"
                    value={item.technologies || ''}
                    onChange={(e) => updateItem(section.id, item.id, 'technologies', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="url"
                    placeholder="Project Link (Optional)"
                    value={item.link || ''}
                    onChange={(e) => updateItem(section.id, item.id, 'link', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <textarea
                  placeholder="Project description and key achievements..."
                  value={item.description || ''}
                  onChange={(e) => updateItem(section.id, item.id, 'description', e.target.value)}
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            ))}
          </div>
        );

      case 'certifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
              />
              <button
                onClick={() => addItem(section.id, 'certifications')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Certification</span>
              </button>
            </div>
            {section.content.items?.map((item: any) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Certification Entry</h4>
                  <button
                    onClick={() => removeItem(section.id, item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Certification Name"
                    value={item.name || ''}
                    onChange={(e) => updateItem(section.id, item.id, 'name', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Issuing Organization"
                    value={item.issuer || ''}
                    onChange={(e) => updateItem(section.id, item.id, 'issuer', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Date Obtained"
                    value={item.date || ''}
                    onChange={(e) => updateItem(section.id, item.id, 'date', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="url"
                    placeholder="Verification Link (Optional)"
                    value={item.link || ''}
                    onChange={(e) => updateItem(section.id, item.id, 'link', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 'languages':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
              />
              <button
                onClick={() => addItem(section.id, 'languages')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Language</span>
              </button>
            </div>
            {section.content.items?.map((item: any) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Language Entry</h4>
                  <button
                    onClick={() => removeItem(section.id, item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Language"
                    value={item.language || ''}
                    onChange={(e) => updateItem(section.id, item.id, 'language', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={item.proficiency || 'Intermediate'}
                    onChange={(e) => updateItem(section.id, item.id, 'proficiency', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Native">Native</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        );

      case 'interests':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
              />
              <button
                onClick={() => addItem(section.id, 'interests')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Interest</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.content.items?.map((item: any) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      placeholder="Interest/Hobby"
                      value={item.interest || ''}
                      onChange={(e) => updateItem(section.id, item.id, 'interest', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mr-2"
                    />
                    <button
                      onClick={() => removeItem(section.id, item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'custom':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={section.title}
              onChange={(e) => updateSectionTitle(section.id, e.target.value)}
              placeholder="Section Title"
              className="text-lg font-semibold bg-transparent border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-3 py-2 w-full"
            />
            <textarea
              placeholder="Enter your custom content here..."
              value={section.content.text || ''}
              onChange={(e) => updateSection(section.id, { text: e.target.value })}
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        );

      default:
        return <div>Section type not supported</div>;
    }
  };

  const renderPreview = () => {
    const headerSection = sections.find(s => s.type === 'header');
    const summarySection = sections.find(s => s.type === 'summary');
    const experienceSection = sections.find(s => s.type === 'experience');
    const educationSection = sections.find(s => s.type === 'education');
    const skillsSection = sections.find(s => s.type === 'skills');
    const projectsSection = sections.find(s => s.type === 'projects');
    const otherSections = sections.filter(s => !['header', 'summary', 'experience', 'education', 'skills', 'projects'].includes(s.type));

    return (
      <div className={`bg-white shadow-lg ${currentTemplate.style === 'modern' ? 'border-l-4 border-blue-600' : currentTemplate.style === 'creative' ? 'border-t-4 border-purple-600' : ''}`}>
        {/* Header */}
        {headerSection && (
          <div className={`${currentTemplate.style === 'creative' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-gray-50'} p-8`}>
            <div className="flex items-center space-x-6">
              {currentTemplate.supportsPhoto && headerSection.content.photo && (
                <img 
                  src={headerSection.content.photo} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              )}
              <div className="flex-1">
                <h1 className={`text-3xl font-bold ${currentTemplate.style === 'creative' ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {headerSection.content.name || 'Your Name'}
                </h1>
                <p className={`text-xl ${currentTemplate.style === 'creative' ? 'text-purple-100' : 'text-gray-600'} mb-4`}>
                  {headerSection.content.title || 'Professional Title'}
                </p>
                <div className={`flex flex-wrap gap-4 text-sm ${currentTemplate.style === 'creative' ? 'text-purple-100' : 'text-gray-600'}`}>
                  {headerSection.content.email && (
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{headerSection.content.email}</span>
                    </div>
                  )}
                  {headerSection.content.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{headerSection.content.phone}</span>
                    </div>
                  )}
                  {headerSection.content.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{headerSection.content.location}</span>
                    </div>
                  )}
                  {headerSection.content.linkedin && (
                    <div className="flex items-center space-x-1">
                      <Linkedin className="w-4 h-4" />
                      <a href={headerSection.content.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        LinkedIn
                      </a>
                    </div>
                  )}
                  {headerSection.content.website && (
                    <div className="flex items-center space-x-1">
                      <Globe className="w-4 h-4" />
                      <a href={headerSection.content.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-8 space-y-8">
          {/* Summary */}
          {summarySection && summarySection.content.text && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                {summarySection.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{summarySection.content.text}</p>
            </div>
          )}

          {/* Experience */}
          {experienceSection && experienceSection.content.items?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                {experienceSection.title}
              </h2>
              <div className="space-y-6">
                {experienceSection.content.items.map((item: any) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{item.position}</h3>
                        <p className="text-blue-600 font-medium">{item.company}</p>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>{item.duration}</p>
                        {item.location && <p>{item.location}</p>}
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-gray-700 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {educationSection && educationSection.content.items?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                {educationSection.title}
              </h2>
              <div className="space-y-4">
                {educationSection.content.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.degree}</h3>
                      <p className="text-blue-600 font-medium">{item.institution}</p>
                      {item.gpa && <p className="text-gray-600">GPA: {item.gpa}</p>}
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>{item.year}</p>
                      {item.location && <p>{item.location}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skillsSection && skillsSection.content.items?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                {skillsSection.title}
              </h2>
              <div className="space-y-4">
                {skillsSection.content.items.map((item: any) => (
                  <div key={item.id}>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(item.items) && item.items.map((skill: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projectsSection && projectsSection.content.items?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                {projectsSection.title}
              </h2>
              <div className="space-y-6">
                {projectsSection.content.items.map((item: any) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                          <span>{item.name}</span>
                          {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </h3>
                        {item.technologies && (
                          <p className="text-blue-600 font-medium">{item.technologies}</p>
                        )}
                      </div>
                      {item.duration && (
                        <p className="text-sm text-gray-600">{item.duration}</p>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-gray-700 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Sections */}
          {otherSections.map((section) => (
            <div key={section.id}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                {section.title}
              </h2>
              {section.type === 'certifications' && section.content.items?.length > 0 && (
                <div className="space-y-4">
                  {section.content.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                          <span>{item.name}</span>
                          {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </h3>
                        <p className="text-blue-600 font-medium">{item.issuer}</p>
                      </div>
                      <p className="text-sm text-gray-600">{item.date}</p>
                    </div>
                  ))}
                </div>
              )}
              {section.type === 'languages' && section.content.items?.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {section.content.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{item.language}</span>
                      <span className="text-sm text-gray-600">{item.proficiency}</span>
                    </div>
                  ))}
                </div>
              )}
              {section.type === 'interests' && section.content.items?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {section.content.items.map((item: any) => (
                    <span key={item.id} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {item.interest}
                    </span>
                  ))}
                </div>
              )}
              {section.type === 'custom' && section.content.text && (
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {section.content.text}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Builder</h1>
            <p className="text-gray-600">Create your professional resume with our advanced builder and photo support</p>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Resume Title"
            />
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Palette className="w-4 h-4" />
              <span>Templates</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Editor Panel */}
        <div className="space-y-6">
          {/* Template Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{currentTemplate.name}</h3>
                <p className="text-sm text-gray-600">
                  {currentTemplate.supportsPhoto ? 'Supports photo upload' : 'Text-only template'} • {currentTemplate.style} style
                </p>
              </div>
            </div>
          </div>

          {/* Section Navigation */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Sections</h3>
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {section.type === 'header' && <User className="w-5 h-5" />}
                    {section.type === 'summary' && <FileText className="w-5 h-5" />}
                    {section.type === 'experience' && <Briefcase className="w-5 h-5" />}
                    {section.type === 'education' && <GraduationCap className="w-5 h-5" />}
                    {section.type === 'skills' && <Star className="w-5 h-5" />}
                    {section.type === 'projects' && <Code className="w-5 h-5" />}
                    {section.type === 'certifications' && <Award className="w-5 h-5" />}
                    {section.type === 'languages' && <Globe className="w-5 h-5" />}
                    {section.type === 'interests' && <Heart className="w-5 h-5" />}
                    {section.type === 'custom' && <Plus className="w-5 h-5" />}
                    <span className="font-medium">{section.title}</span>
                  </div>
                  {!['header', 'summary'].includes(section.type) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSection(section.id);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </button>
              ))}
            </div>

            {/* Add Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Add Section</h4>
              <div className="grid grid-cols-2 gap-2">
                {availableSectionTypes.map((sectionType) => (
                  <button
                    key={sectionType.type}
                    onClick={() => addSection(sectionType.type)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <sectionType.icon className="w-4 h-4" />
                    <span>{sectionType.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section Editor */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {sections.find(s => s.id === activeSection) && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Edit {sections.find(s => s.id === activeSection)?.title}
                </h3>
                {renderSectionEditor(sections.find(s => s.id === activeSection)!)}
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={saveResume}
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{isSaving ? 'Saving...' : 'Save Resume'}</span>
            </button>
            <button
              onClick={downloadPDF}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:sticky lg:top-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>{isPreviewMode ? 'Edit Mode' : 'Full Preview'}</span>
              </button>
            </div>
            
            <div 
              ref={resumePreviewRef}
              className={`${isPreviewMode ? 'fixed inset-0 z-50 bg-white overflow-auto p-8' : 'max-h-[800px] overflow-auto'} border border-gray-200 rounded-lg`}
            >
              {isPreviewMode && (
                <button
                  onClick={() => setIsPreviewMode(false)}
                  className="fixed top-4 right-4 z-10 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
              {renderPreview()}
            </div>
          </div>
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Choose Template</h3>
              <button
                onClick={() => setShowTemplateSelector(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => {
                      setCurrentTemplate(template);
                      setShowTemplateSelector(false);
                    }}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-lg ${
                      currentTemplate.id === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={template.preview}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 capitalize">{template.style}</span>
                      <div className="flex items-center space-x-2">
                        {template.supportsPhoto && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            Photo Support
                          </span>
                        )}
                        {currentTemplate.id === template.id && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-16 text-center py-8 border-t border-gray-200">
        <p className="text-gray-600">
          Powered by AI • Built with ❤️ for job seekers worldwide
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Developed by <span className="font-semibold">Harsha Vardhan Bodapati</span>
        </p>
      </div>
    </div>
  );
};

export default ResumeBuilder;