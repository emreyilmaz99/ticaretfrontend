// Satıcı türleri
export const MERCHANT_TYPES = {
  personal: { 
    value: 'personal', 
    label: 'Bireysel Satıcı', 
    description: 'Şahıs olarak satış yapacaksınız',
    icon: '👤'
  },
  private_company: { 
    value: 'private_company', 
    label: 'Şahıs Şirketi', 
    description: 'Şahıs şirketi olarak satış yapacaksınız',
    icon: '🏪'
  },
  limited_company: { 
    value: 'limited_company', 
    label: 'Limited / Anonim Şirket', 
    description: 'Tüzel kişilik olarak satış yapacaksınız',
    icon: '🏢'
  }
};

// Initial form state
export const INITIAL_FORM_STATE = {
  full_name: '',
  company_name: '',
  slug: '',
  phone: '',
  // iyzico SubMerchant fields
  merchant_type: '',
  identity_number: '',
  contact_name: '',
  contact_surname: '',
  tax_id: '',
  tax_office: '',
  legal_company_title: '',
  // Address fields
  address: '',
  city: '',
  district: '',
  postal_code: '',
  // Bank account fields
  bank_name: '',
  account_holder: '',
  iban: ''
};

/**
 * Generates all styles for the full application page
 */
export const getStyles = () => {
  const isMobile = window.innerWidth <= 768;
  
  return {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    padding: isMobile ? '10px' : '20px'
  },
  card: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: 'white',
    borderRadius: isMobile ? '16px' : '24px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: isMobile ? '24px 16px' : '48px',
    position: 'relative',
    overflow: 'hidden'
  },
  cardWide: {
    maxWidth: isMobile ? '100%' : '700px'
  },
  header: {
    textAlign: 'center',
    marginBottom: isMobile ? '24px' : '40px',
    marginTop: isMobile ? '40px' : '0'
  },
  iconWrapper: {
    width: isMobile ? '56px' : '64px',
    height: isMobile ? '56px' : '64px',
    backgroundColor: '#d1fae5',
    color: '#047857',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: isMobile ? '20px' : '24px',
    margin: isMobile ? '0 auto 16px auto' : '0 auto 24px auto'
  },
  iconWrapperError: {
    backgroundColor: '#fee2e2',
    color: '#dc2626'
  },
  iconWrapperWarning: {
    backgroundColor: '#fef3c7',
    color: '#d97706'
  },
  title: {
    fontFamily: '"Playfair Display", serif',
    fontSize: isMobile ? '24px' : '32px',
    fontWeight: '700',
    color: '#064e3b',
    marginBottom: '8px'
  },
  titleError: {
    color: '#dc2626'
  },
  titleWarning: {
    color: '#d97706'
  },
  subtitle: {
    color: '#64748b',
    fontSize: isMobile ? '14px' : '16px',
    lineHeight: '1.5'
  },
  backButton: {
    position: 'absolute',
    top: isMobile ? '16px' : '24px',
    left: isMobile ? '16px' : '24px',
    background: isMobile ? 'rgba(5, 150, 105, 0.1)' : 'none',
    border: isMobile ? '1px solid rgba(5, 150, 105, 0.2)' : 'none',
    borderRadius: isMobile ? '50%' : '0',
    width: isMobile ? '40px' : 'auto',
    height: isMobile ? '40px' : 'auto',
    padding: isMobile ? '0' : 'initial',
    color: '#047857',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? '0' : '8px',
    fontSize: isMobile ? '16px' : '14px',
    transition: 'all 0.2s',
    zIndex: 10
  },
  formGroup: {
    marginBottom: isMobile ? '16px' : '20px'
  },
  label: {
    display: 'block',
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '8px'
  },
  inputWrapper: {
    position: 'relative'
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    fontSize: isMobile ? '14px' : '16px'
  },
  input: {
    width: '100%',
    padding: isMobile ? '12px 14px 12px 42px' : '14px 16px 14px 48px',
    borderRadius: isMobile ? '10px' : '12px',
    border: '1px solid #e2e8f0',
    fontSize: isMobile ? '14px' : '15px',
    color: '#1e293b',
    transition: 'all 0.2s',
    outline: 'none',
    backgroundColor: '#f8fafc'
  },
  inputFocus: {
    borderColor: '#059669',
    boxShadow: '0 0 0 4px rgba(5, 150, 105, 0.1)',
    backgroundColor: 'white'
  },
  inputHint: {
    color: '#64748b',
    fontSize: isMobile ? '11px' : '12px',
    marginTop: '4px',
    display: 'block'
  },
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: isMobile ? '12px' : '16px'
  },
  gridThree: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: isMobile ? '20px' : '24px'
  },
  sectionTitle: {
    textAlign: 'left',
    marginTop: isMobile ? '24px' : '32px',
    marginBottom: isMobile ? '12px' : '16px',
    fontWeight: '600',
    fontSize: isMobile ? '16px' : '18px',
    color: '#047857'
  },
  merchantTypeCard: {
    padding: isMobile ? '14px' : '16px',
    borderRadius: isMobile ? '10px' : '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center'
  },
  merchantTypeCardActive: {
    border: '2px solid #047857',
    backgroundColor: '#f0fdf4'
  },
  merchantTypeCardInactive: {
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc'
  },
  merchantTypeIcon: {
    fontSize: isMobile ? '20px' : '24px',
    marginBottom: isMobile ? '6px' : '8px'
  },
  merchantTypeLabel: {
    fontWeight: '600',
    color: '#1e293b',
    fontSize: isMobile ? '13px' : '14px'
  },
  merchantTypeDesc: {
    fontSize: isMobile ? '10px' : '11px',
    color: '#64748b',
    marginTop: '4px'
  },
  warningBox: {
    marginTop: isMobile ? '20px' : '24px',
    marginBottom: isMobile ? '12px' : '16px',
    padding: isMobile ? '14px' : '16px',
    backgroundColor: '#fffbeb',
    borderRadius: isMobile ? '10px' : '12px',
    border: '1px solid #fde68a'
  },
  warningText: {
    fontSize: isMobile ? '13px' : '14px',
    color: '#92400e',
    lineHeight: '1.6'
  },
  termsBox: {
    marginBottom: isMobile ? '20px' : '24px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: isMobile ? '10px' : '12px',
    padding: isMobile ? '14px' : '16px',
    backgroundColor: '#f0fdf4',
    borderRadius: isMobile ? '10px' : '12px',
    border: '1px solid #dcfce7'
  },
  termsCheckbox: {
    marginTop: '4px',
    width: isMobile ? '16px' : '18px',
    height: isMobile ? '16px' : '18px',
    accentColor: '#047857',
    cursor: 'pointer'
  },
  termsLabel: {
    fontSize: isMobile ? '13px' : '14px',
    color: '#334155',
    lineHeight: '1.5',
    cursor: 'pointer'
  },
  termsLink: {
    fontWeight: '600',
    color: '#047857'
  },
  buttonPrimary: {
    width: '100%',
    padding: isMobile ? '14px' : '16px',
    backgroundColor: '#047857',
    color: 'white',
    border: 'none',
    borderRadius: isMobile ? '10px' : '12px',
    fontSize: isMobile ? '15px' : '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  buttonCentered: {
    marginTop: isMobile ? '20px' : '24px',
    maxWidth: isMobile ? '100%' : '200px',
    margin: isMobile ? '20px auto 0' : '24px auto 0'
  }
};
};

export const styles = getStyles();
