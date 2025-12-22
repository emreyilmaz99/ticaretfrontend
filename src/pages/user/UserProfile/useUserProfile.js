// src/pages/user/UserProfile/useUserProfile.js
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile, updateUserPassword, uploadUserAvatar, deleteUserAvatar } from '../../../features/user/api/userAuthApi';
import { useToast } from '../../../components/common/Toast';
import { useAuth } from '../../../context/AuthContext';

export const useUserProfile = () => {
  const qc = useQueryClient();
  const toast = useToast();
  const { refreshUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // profile, addresses, security, orders
  const [isSaving, setIsSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Form state
  const [form, setForm] = useState({
    name: '',
    phone: '',
    identity_number: '',
    birth_date: '',
    gender: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });

  // Fetch user profile
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: getUserProfile
  });

  const user = profileData?.data?.user;

  // Populate form when user data is loaded
  useEffect(() => {
    if (user) {
      // LocalStorage'dan oku (backend bu alanları döndürmüyor)
      const savedBirthDate = localStorage.getItem('user_birth_date');
      const savedGender = localStorage.getItem('user_gender');
      
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        identity_number: user.identity_number || '',
        birth_date: user.birth_date || savedBirthDate || '',
        gender: user.gender || savedGender || ''
      });
      if (user.avatar) setAvatarPreview(user.avatar);
    }
  }, [user]);

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: (data) => updateUserProfile(data),
    onSuccess: async (response, variables) => {
      console.log('[UserProfile] Full Response:', response);
      console.log('[UserProfile] Gönderilen variables:', variables);
      
      // Backend'den response.data doğrudan user objesi olarak geliyor
      // AMA birth_date ve gender backend response'unda dönmüyor
      // O yüzden gönderdiğimiz data'yı (variables) kullanıyoruz
      const updatedUser = response?.data;
      
      // Form'u gönderdiğimiz data ile güncelle (çünkü backend başarılı dedi)
      setForm({
        name: updatedUser?.name || variables.name || '',
        phone: updatedUser?.phone || variables.phone || '',
        identity_number: updatedUser?.identity_number || variables.identity_number || '',
        birth_date: variables.birth_date || '', // Backend'den gelmediği için gönderdiğimiz data'yı kullan
        gender: variables.gender || '' // Backend'den gelmediği için gönderdiğimiz data'yı kullan
      });
      
      // LocalStorage'a kaydet (sayfa yenilendiğinde kaybolmasın)
      if (variables.birth_date) {
        localStorage.setItem('user_birth_date', variables.birth_date);
      }
      if (variables.gender) {
        localStorage.setItem('user_gender', variables.gender);
      }
      
      console.log('[UserProfile] Form güncellendi ve localStorage\'a kaydedildi:', {
        birth_date: variables.birth_date,
        gender: variables.gender
      });
      
      // Query cache'i güncelle ve auth context'i refresh et
      qc.invalidateQueries(['user', 'profile']);
      refreshUser(); // Auth context'teki user'ı arka planda güncelle
      
      toast.success('Başarılı', 'Profil bilgileriniz güncellendi.');
      setIsSaving(false);
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Güncelleme başarısız.');
      setIsSaving(false);
    }
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: (data) => updateUserPassword(data),
    onSuccess: () => {
      toast.success('Başarılı', 'Şifreniz güncellendi.');
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
      setIsSaving(false);
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Şifre güncellenemedi.');
      setIsSaving(false);
    }
  });

  // Avatar upload mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: (file) => uploadUserAvatar(file),
    onSuccess: (res) => {
      qc.invalidateQueries(['user', 'profile']);
      refreshUser();
      setAvatarPreview(res.data?.avatar);
      setAvatarFile(null);
      toast.success('Başarılı', 'Profil fotoğrafı güncellendi.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Fotoğraf yüklenemedi.');
    }
  });

  // Delete avatar mutation
  const deleteAvatarMutation = useMutation({
    mutationFn: () => deleteUserAvatar(),
    onSuccess: () => {
      qc.invalidateQueries(['user', 'profile']);
      refreshUser();
      setAvatarPreview(null);
      toast.success('Başarılı', 'Profil fotoğrafı kaldırıldı.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Fotoğraf kaldırılamadı.');
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Auto upload
      uploadAvatarMutation.mutate(file);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    console.log('[UserProfile] Profil güncelleniyor, gönderilen data:', form);
    updateMutation.mutate(form);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.password_confirmation) {
      toast.warning('Hata', 'Yeni şifreler eşleşmiyor.');
      return;
    }
    setIsSaving(true);
    updatePasswordMutation.mutate(passwordForm);
  };

  return {
    user,
    isLoading,
    activeTab,
    setActiveTab,
    isSaving,
    isMobile,
    form,
    setForm,
    passwordForm,
    setPasswordForm,
    avatarPreview,
    handleFileChange,
    handleProfileSubmit,
    handlePasswordSubmit,
    deleteAvatarMutation,
    logout
  };
};
