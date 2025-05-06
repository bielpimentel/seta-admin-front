import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'usuários',
    path: '/usuarios',
    icon: icon('ic_user_list'),
  },  
  {
    title: 'logs de acesso',
    path: '/logs-de-acesso',
    icon: icon('ic_logs'),
  },  
  {
    title: 'cadastros pendentes',
    path: '/cadastros-pendentes',
    icon: icon('ic_pending'),
  },
  {
    title: 'e-mails permitidos',
    path: '/emails-permitidos',
    icon: icon('ic_mail'),
  },
  {
    title: 'suporte',
    path: '/suporte',
    icon: icon('ic_support'),
  },
];

export default navConfig;
