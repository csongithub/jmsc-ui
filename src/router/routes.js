
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'home', path: '', component: () => import('pages/main/home/Home.vue') },
      { name: 'account', path: '/account', component: () => import('pages/main/account/BankAccount.vue') },
      { name: 'creditors', path: '/party_accounts', component: () => import('src/pages/main/party/PartyAccounts.vue') },
      { name: 'managePartyAccounts', path: '/manage_party_accounts', component: () => import('src/pages/main/party/ManagePartyAccounts.vue') },
      { name: 'importPartyAccounts', path: '/import_party_accounts', component: () => import('src/pages/main/party/ImportPartyAccounts.vue') },
      { name: 'creditFacility', path: '/credit_facility', component: () => import('src/pages/main/cf/CreditFacility.vue') },
      { name: 'allCF', path: '/all_cf', component: () => import('src/pages/main/cf/AllCF.vue') },
      { name: 'bankGuarantee', path: '/bank_guarantee', component: () => import('src/pages/main/cf/BankGuarantee.vue') },
      { name: 'fixedDeposit', path: '/fixed_deposit', component: () => import('src/pages/main/cf/FixedDeposit.vue') },
      { name: 'nsc', path: '/nsc', component: () => import('src/pages/main/cf/NSC.vue') },
      { name: 'cfLinkageDetails', path: '/cf_linkage_details', component: () => import('src/pages/main/cf/LinkageDetails.vue') },
      { name: 'bgGroup', path: '/bg_group', component: () => import('src/pages/main/cf/BGGroup.vue') },
      { name: 'bgGroupDetails', path: '/bg_group_details', component: () => import('src/pages/main/cf/BGGroupDetails.vue') },
      { name: 'loans', path: '/loans', component: () => import('src/pages/main/cf/Loan.vue') },
      { name: 'profile', path: '/profile', component: () => import('src/pages/auth/Profile.vue') },

      { name: 'bidding', path: '/bidding', component: () => import('pages/main/bidding/Bidding.vue') },
      { name: 'activeBids', path: '/active_bids', component: () => import('pages/main/bidding/ActiveBids.vue') },
      { name: 'submittedBids', path: '/submitted_bids', component: () => import('pages/main/bidding/SubmittedBids.vue') },
      { name: 'acceptedBids', path: '/accepted_bids', component: () => import('pages/main/bidding/AcceptedBids.vue') },
      { name: 'rejectedBids', path: '/rejected_bids', component: () => import('pages/main/bidding/RejectedBids.vue') },
      { name: 'awardedBids', path: '/awarded_bids', component: () => import('pages/main/bidding/AwardedBids.vue') },
      { name: 'site', path: '/site', component: () => import('pages/main/site/Site.vue') },
      { name: 'party', path: '/party', component: () => import('pages/main/party/Party.vue') },
      { name: 'users', path: '/users', component: () => import('pages/main/users/Users.vue') },

      { name: 'machine', path: '/machine', component: () => import('pages/main/machine/Machine.vue') },
     
      { name: 'payment', path: '/payment', component: () => import('pages/main/payment/Payment.vue') },
      { name: 'createPaymentNew', path: '/create_payment', component: () => import('pages/main/payment/CreatePayment.vue') },
      { name: 'paymentDraft', path: '/payment_draft', component: () => import('pages/main/payment/PaymentDraft.vue') },
      { name: 'paymentApprovals', path: '/payments_approvals', component: () => import('pages/main/payment/Approvals.vue') },
      { name: 'paymentHistory', path: '/payments', component: () => import('pages/main/payment/PaymentHistory.vue') },

      { name: 'accountStore', path: '/account_store', component: () => import('pages/main/account-store/AccountStore.vue') },
      { name: 'notification', path: '/notifications', component: () => import('pages/main/notification/Notifications.vue') },

      { name: 'drive', path: '/drive', component: () => import('pages/main/drive/Drive.vue') },
      { name: 'directoryFiles', path: '/directory_files', component: () => import('src/pages/main/drive/DirectoryFiles.vue') },
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => import("layouts/LoginLayout.vue"),
    children: []
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
