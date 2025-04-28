import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface ContactFormProps {
  onSuccess?: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    comment: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-()]{8,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // Submit logic would go here
      console.log('Form submitted:', formData);
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        fullWidth
        required
      />
      
      <Input
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        fullWidth
        required
      />
      
      <div className="mb-4">
        <label className="block text-sm font-light text-gray-700 mb-1">
          Comment
        </label>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          rows={4}
          className="w-full border-b border-gray-300 py-2 px-4 font-light
            focus:outline-none focus:border-black
            transition-colors bg-transparent"
        ></textarea>
      </div>
      
      <Button type="submit" variant="primary" fullWidth>
        Submit
      </Button>
    </form>
  );
};

export default ContactForm;