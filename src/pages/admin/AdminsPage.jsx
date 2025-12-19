import React from 'react';
import { FaUserShield } from 'react-icons/fa';
import AdminList from '../../features/admin/components/AdminList';
import PageHeader from '../../components/admin/PageHeader';

const AdminsPage = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ padding: isMobile ? '16px' : '32px', backgroundColor: '#F3F4F6', minHeight: '100vh' }}>
      <PageHeader
        icon={FaUserShield}
        title="Kullanıcılar"
        subtitle="Sistemdeki kayıtlı kullanıcıları görüntüleyin ve yönetin."
        isMobile={isMobile}
      />
      
      <AdminList />
    </div>
  );
};

export default AdminsPage;
