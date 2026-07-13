import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, Trash2 } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import TextArea from '../../ui/TextArea';
import Checkbox from '../../ui/Checkbox';
import Select from '../../ui/Select';
import type { TeamMember, Department } from '../../../types/team';
import type { MediaFile } from '../../../services/media.service';
import { useCreateTeamMember, useUpdateTeamMember } from '../../../hooks/useTeamAdmin';
import { resolveImageUrl } from '../../../utils/imageHelper';
import MediaPickerModal from '../media/MediaPickerModal';

interface TeamMemberDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
  departments: Department[];
}

export default function TeamMemberDrawer({ isOpen, onClose, member, departments }: TeamMemberDrawerProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [slug, setSlug] = useState('');
  const [position, setPosition] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState<number | ''>('');
  const [shortBio, setShortBio] = useState('');
  const [biography, setBiography] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [website, setWebsite] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  
  // Skills
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // Media Picker
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<MediaFile | null>(null);

  const { mutateAsync: createMember, isPending: isCreating } = useCreateTeamMember();
  const { mutateAsync: updateMember, isPending: isUpdating } = useUpdateTeamMember();

  useEffect(() => {
    if (member) {
      setFirstName(member.first_name);
      setLastName(member.last_name);
      setSlug(member.slug);
      setPosition(member.position);
      setDepartmentId(member.department?.id || '');
      setYearsOfExperience(member.years_of_experience ?? '');
      setShortBio(member.short_bio);
      setBiography(member.biography);
      setEmail(member.email || '');
      setPhone(member.phone || '');
      setLinkedin(member.linkedin_url || '');
      setGithub(member.github_url || '');
      setTwitter(member.twitter_url || '');
      setWebsite(member.website_url || '');
      setDisplayOrder(member.display_order);
      setIsFeatured(member.is_featured);
      setIsActive(member.is_active);
      setSkills(member.skills || []);
      // Map member photo back to mock MediaFile just to render
      if (member.photo) {
        setSelectedPhoto({
          id: member.photo.id,
          file: member.photo.file,
          file_name: member.photo.file_name,
          alt_text: member.photo.alt_text,
          folder: null,
          title: '',
          caption: '',
          description: '',
          mime_type: 'image/jpeg',
          extension: 'jpg',
          checksum: '',
          is_public: true,
          file_size: 0,
          width: null,
          height: null,
          created_at: '',
          updated_at: ''
        });
      } else {
        setSelectedPhoto(null);
      }
    } else {
      resetForm();
    }
  }, [member, isOpen]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setSlug('');
    setPosition('');
    setDepartmentId('');
    setYearsOfExperience('');
    setShortBio('');
    setBiography('');
    setEmail('');
    setPhone('');
    setLinkedin('');
    setGithub('');
    setTwitter('');
    setWebsite('');
    setDisplayOrder(0);
    setIsFeatured(false);
    setIsActive(true);
    setSkills([]);
    setSelectedPhoto(null);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        slug,
        position,
        department: departmentId || undefined,
        years_of_experience: yearsOfExperience === '' ? 0 : yearsOfExperience,
        short_bio: shortBio,
        biography,
        email,
        phone,
        linkedin_url: linkedin,
        github_url: github,
        twitter_url: twitter,
        website_url: website,
        display_order: displayOrder,
        is_featured: isFeatured,
        is_active: isActive,
        skills,
        photo: selectedPhoto?.id || null,
      };

      if (member) {
        await updateMember({ id: member.id, data: payload });
      } else {
        await createMember(payload);
      }
      onClose();
    } catch (err) {
      console.error('Failed to save team member', err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-surface-light shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-6 border-b border-border-primary shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-primary-text">
              {member ? 'Edit Team Member' : 'Add Team Member'}
            </h2>
            <p className="text-secondary-text text-sm">Professional Profile Information</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-secondary-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <form id="team-form" onSubmit={handleSubmit} className="space-y-10">
            
            {/* GENERAL SECTION */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text border-b border-border-primary pb-2">General</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" required value={firstName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} />
                <Input label="Last Name" required value={lastName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} />
              </div>
              <Input label="Slug (Auto-generated if empty)" value={slug} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlug(e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Position / Title" required value={position} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPosition(e.target.value)} />
                <Select 
                  label="Department"
                  required
                  value={departmentId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDepartmentId(e.target.value)}
                  options={[
                    { value: '', label: 'Select a department' },
                    ...departments.map(d => ({ value: d.id, label: d.name }))
                  ]}
                />
              </div>
              <Input 
                label="Years of Experience" 
                type="number" 
                value={yearsOfExperience.toString()} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setYearsOfExperience(parseInt(e.target.value) || '')} 
              />
            </section>

            {/* MEDIA SECTION */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text border-b border-border-primary pb-2">Media</h3>
              <div className="flex items-start gap-6">
                <div 
                  className="w-32 h-32 rounded-xl bg-black/5 dark:bg-white/5 border-2 border-dashed border-border-primary flex items-center justify-center overflow-hidden shrink-0 relative group"
                >
                  {selectedPhoto ? (
                    <>
                      <img src={resolveImageUrl(selectedPhoto.file)} alt="Profile" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => setSelectedPhoto(null)}
                          className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <ImageIcon className="w-8 h-8 text-secondary-text/50" />
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-sm text-secondary-text">Select a professional portrait from the Enterprise Media Library. Recommended size: 600x600px minimum.</p>
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={() => setIsMediaPickerOpen(true)}
                  >
                    {selectedPhoto ? 'Replace Photo' : 'Select Photo'}
                  </Button>
                </div>
              </div>
            </section>

            {/* PROFILE SECTION */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text border-b border-border-primary pb-2">Profile</h3>
              <TextArea 
                label="Short Bio (Cards & Grid Views)" 
                value={shortBio} 
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setShortBio(e.target.value)} 
                rows={2} 
                placeholder="Brief summary..."
              />
              <TextArea 
                label="Full Biography (Detail Page)" 
                value={biography} 
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBiography(e.target.value)} 
                rows={5} 
              />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Public Email" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                <Input label="Phone Number" value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} />
              </div>
            </section>

            {/* SKILLS SECTION */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text border-b border-border-primary pb-2">Skills</h3>
              <div className="flex gap-2">
                <Input 
                  placeholder="e.g. React, Python, AWS..."
                  value={newSkill}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSkill(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  className="flex-1"
                />
                <Button type="button" variant="secondary" onClick={handleAddSkill}>Add</Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full text-sm font-medium">
                      <span>{skill}</span>
                      <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* SOCIAL LINKS */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text border-b border-border-primary pb-2">Social Links</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="LinkedIn URL" type="url" value={linkedin} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkedin(e.target.value)} placeholder="https://..." />
                <Input label="GitHub URL" type="url" value={github} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGithub(e.target.value)} placeholder="https://..." />
                <Input label="X (Twitter) URL" type="url" value={twitter} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTwitter(e.target.value)} placeholder="https://..." />
                <Input label="Portfolio / Website" type="url" value={website} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWebsite(e.target.value)} placeholder="https://..." />
              </div>
            </section>

            {/* PUBLISHING */}
            <section className="space-y-4 pb-12">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text border-b border-border-primary pb-2">Publishing</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Display Order" 
                  type="number" 
                  value={displayOrder.toString()} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayOrder(parseInt(e.target.value) || 0)} 
                />
              </div>
              <div className="space-y-3 pt-2">
                <Checkbox 
                  label="Featured Leader (Promote on Homepage)"
                  checked={isFeatured}
                  onChange={() => setIsFeatured(!isFeatured)}
                />
                <Checkbox 
                  label="Active (Visible to public)"
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                />
              </div>
            </section>
          </form>
        </div>

        <div className="p-6 border-t border-border-primary flex justify-end gap-3 bg-black/2 dark:bg-white/2 shrink-0">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            form="team-form"
            isLoading={isCreating || isUpdating}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile
          </Button>
        </div>
      </div>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(media: MediaFile | MediaFile[]) => {
          const file = Array.isArray(media) ? media[0] : media;
          setSelectedPhoto(file);
          setIsMediaPickerOpen(false);
        }}
      />
    </>
  );
}
