
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'home', path: '', component: () => import('pages/main/account/BankAccount.vue') },
      { name: 'payment', path: '/payment', component: () => import('pages/main/payment/Payment.vue') },
      { name: 'createPayment', path: '/create_payment', component: () => import('pages/main/payment/CreatePayment.vue') },
      { name: 'printPayment', path: '/print_payment', component: () => import('pages/main/payment/PrintPayment.vue') },
      { name: 'creditors', path: '/party_accounts', component: () => import('src/pages/main/party/PartyAccounts.vue') },
      { name: 'managePartyAccounts', path: '/manage_party_accounts', component: () => import('src/pages/main/party/ManagePartyAccounts.vue') },
      { name: 'importPartyAccounts', path: '/import_party_accounts', component: () => import('src/pages/main/party/ImportPartyAccounts.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
