import React from 'react';
import Heading from '../../components/ui/Heading';
import Text from '../../components/ui/Text';
import { Construction } from 'lucide-react';

interface AdminStubPageProps {
  title: string;
  description: string;
}

const AdminStubPage: React.FC<AdminStubPageProps> = ({ title, description }) => {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center max-w-lg mx-auto animate-fade-in">
      <div className="w-16 h-16 bg-accent-primary/10 text-accent-primary rounded-full flex items-center justify-center mb-6 border border-accent-primary/20">
        <Construction className="w-8 h-8" />
      </div>
      <Heading variant="h2" className="text-2xl mb-3 tracking-tight">
        {title}
      </Heading>
      <Text variant="body" className="text-secondary-text">
        {description}
      </Text>
      <div className="mt-8 px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <Text variant="small" className="text-blue-500 font-medium">
          This module manager is currently under construction. Please check back in a future update.
        </Text>
      </div>
    </div>
  );
};

export default AdminStubPage;
