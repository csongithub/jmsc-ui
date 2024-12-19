const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "home",
        path: "",
        component: () => import("pages/main/home/Home.vue"),
        meta: {
          breadcrumbs: [{ label: "Home", routName: "home" }],
        },
      },
      {
        name: "account",
        path: "/account",
        component: () => import("pages/main/account/BankAccount.vue"),
        meta: {
          moduleName: "Banking",
          breadcrumbs: [
            { label: "Banking", routName: "" },
            { label: "Bank Acccounts", routName: "account" },
          ],
        },
      },
      {
        name: "creditors",
        path: "/party_accounts",
        component: () => import("src/pages/main/party/PartyAccounts.vue"),
        meta: {
          moduleName: "Banking",
          breadcrumbs: [
            { label: "Banking", routName: "" },
            { label: "Party Accounts", routName: "party_accounts" },
          ],
        },
      },
      {
        name: "managePartyAccounts",
        path: "/all_party_accounts",
        component: () => import("src/pages/main/party/AllPartyAccounts.vue"),
        meta: {
          moduleName: "Banking",
          breadcrumbs: [
            { label: "Banking", routName: "" },
            { label: "Party Accounts", routName: "party_accounts" },
            { label: "All Party Accounts", routName: "manage_party_accounts" },
          ],
        },
      },
      {
        name: "importPartyAccounts",
        path: "/import_party_accounts",
        component: () => import("src/pages/main/party/ImportPartyAccounts.vue"),
        meta: {
          moduleName: "Banking",
          breadcrumbs: [
            { label: "Banking", routName: "" },
            { label: "Party Accounts", routName: "party_accounts" },
            {
              label: "Import Party Accounts",
              routName: "import_party_accounts",
            },
          ],
        },
      },
      {
        name: "creditFacility",
        path: "/credit_facility",
        component: () => import("src/pages/main/cf/CreditFacility.vue"),
        meta: {
          moduleName: "Banking",
          breadcrumbs: [
            { label: "Banking", routName: "" },
            { label: "Credit Facility", routName: "credit_facility" },
          ],
        },
      },
      {
        name: "bankGuaranteeNew",
        path: "/bank_guarantee_new",
        component: () => import("src/pages/main/bg/BankGuarantee.vue"),
        meta: {
          moduleName: "Banking",
          breadcrumbs: [
            { label: "Banking", routName: "" },
            { label: "Bank Guarantee", routName: "bank_guarantee_new" },
          ],
        },
      },
      {
        name: "einvoice",
        path: "/einvoice",
        component: () => import("src/pages/main/einvoice/EInvoice.vue"),
        meta: {
          moduleName: "Banking",
          breadcrumbs: [
            { label: "eInvoice", routName: "" },
            { label: "eInvoice", routName: "einvoice" },
          ],
        },
      },
      {
        name: "allCF",
        path: "/all_cf",
        component: () => import("src/pages/main/cf/AllCF.vue"),
        meta: {
          moduleName: "Banking",
          breadcrumbs: [
            { label: "Banking", routName: "" },
            { label: "Credit Facility", routName: "credit_facility" },
            { label: "All Facility", routName: "all_cf" },
          ],
        },
      },
      {
        name: "bankGuarantee",
        path: "/bank_guarantee",
        component: () => import("src/pages/main/cf/BankGuarantee.vue"),
        meta: {
          moduleName: "Banking",
          breadcrumbs: [
            { label: "Banking", routName: "" },
            { label: "Credit Facility", routName: "credit_facility" },
            { label: "Bank Guarantee", routName: "bank_guarantee" },
          ],
        },
      },
      {
        name: "fixedDeposit",
        path: "/fixed_deposit",
        component: () => import("src/pages/main/cf/FixedDeposit.vue"),
        meta: {
          moduleName: "Banking",
          breadcrumbs: [
            { label: "Banking", routName: "" },
            { label: "Credit Facility", routName: "credit_facility" },
            { label: "Fix Deposits", routName: "fixed_deposit" },
          ],
        },
      },
      {
        name: "nsc",
        path: "/nsc",
        component: () => import("src/pages/main/cf/NSC.vue"),
        meta: {
          moduleName: "Banking",
          breadcrumbs: [
            { label: "Banking", routName: "" },
            { label: "Credit Facility", routName: "credit_facility" },
            { label: "Post Office NSCs", routName: "nsc" },
          ],
        },
      },

      {
        name: "cfLinkageDetails",
        path: "/cf_linkage_details",
        component: () => import("src/pages/main/cf/LinkageDetails.vue"),
        meta: {
          moduleName: "Banking",
          breadcrumbs: [
            { label: "Banking", routName: "" },
            { label: "Credit Facility", routName: "credit_facility" },
            {
              label: "Facility Linkage Details",
              routName: "cf_linkage_details",
            },
          ],
        },
      },
      {
        name: "bgGroup",
        path: "/bg_group",
        component: () => import("src/pages/main/cf/BGGroup.vue"),
        meta: {
          moduleName: "Banking",
          breadcrumbs: [
            { label: "Banking", routName: "" },
            { label: "BG Group", routName: "bg_group" },
          ],
        },
      },
      {
        name: "bgGroupDetails",
        path: "/bg_group_details",
        component: () => import("src/pages/main/cf/BGGroupDetails.vue"),
        meta: {
          moduleName: "Banking",
          breadcrumbs: [
            { label: "Banking", routName: "" },
            { label: "BG Group", routName: "bg_group" },
            { label: "BG Group Details", routName: "bg_group_details" },
          ],
        },
      },
      {
        name: "loans",
        path: "/loans",
        component: () => import("src/pages/main/cf/Loan.vue"),
        meta: {
          moduleName: "Banking",
          breadcrumbs: [
            { label: "Banking", routName: "" },
            { label: "Loans", routName: "loans" },
          ],
        },
      },
      {
        name: "profile",
        path: "/profile",
        component: () => import("src/pages/auth/Profile.vue"),
        meta: {
          moduleName: "Profile",
          breadcrumbs: [{ label: "Profile", routName: "profile" }],
        },
      },

      {
        name: "bidding",
        path: "/bidding",
        component: () => import("pages/main/bidding/Bidding.vue"),
        meta: {
          moduleName: "Bidding",
          breadcrumbs: [{ label: "Bidding", routName: "bidding" }],
        },
      },
      {
        name: "activeBids",
        path: "/active_bids",
        component: () => import("pages/main/bidding/ActiveBids.vue"),
        meta: {
          moduleName: "Bidding",
          breadcrumbs: [
            { label: "Bidding", routName: "bidding" },
            { label: "Active Bids", routName: "active_bids" },
          ],
        },
      },
      {
        name: "submittedBids",
        path: "/submitted_bids",
        component: () => import("pages/main/bidding/SubmittedBids.vue"),
        meta: {
          moduleName: "Bidding",
          breadcrumbs: [
            { label: "Bidding", routName: "bidding" },
            { label: "Submitted Bids", routName: "submitted_bids" },
          ],
        },
      },
      {
        name: "acceptedBids",
        path: "/accepted_bids",
        component: () => import("pages/main/bidding/AcceptedBids.vue"),
        meta: {
          moduleName: "Bidding",
          breadcrumbs: [
            { label: "Bidding", routName: "bidding" },
            { label: "Accepted Bids", routName: "accepted_bids" },
          ],
        },
      },
      {
        name: "rejectedBids",
        path: "/rejected_bids",
        component: () => import("pages/main/bidding/RejectedBids.vue"),
        meta: {
          moduleName: "Bidding",
          breadcrumbs: [
            { label: "Bidding", routName: "bidding" },
            { label: "Rejected Bids", routName: "rejected_bids" },
          ],
        },
      },
      {
        name: "awardedBids",
        path: "/awarded_bids",
        component: () => import("pages/main/bidding/AwardedBids.vue"),
        meta: {
          moduleName: "Bidding",
          breadcrumbs: [
            { label: "Bidding", routName: "bidding" },
            { label: "Awarded Bids", routName: "awarded_bids" },
          ],
        },
      },
      {
        name: "site",
        path: "/site",
        component: () => import("pages/main/site/Site.vue"),
        meta: {
          moduleName: "Site",
          breadcrumbs: [{ label: "Sites & Projects", routName: "site" }],
        },
      },
      {
        name: "party",
        path: "/party",
        component: () => import("pages/main/party/Party.vue"),
        meta: {
          moduleName: "Party",
          breadcrumbs: [{ label: "Party", routName: "party" }],
        },
      },
      {
        name: "users",
        path: "/users",
        component: () => import("pages/main/users/Users.vue"),
        meta: {
          moduleName: "Users",
          breadcrumbs: [{ label: "Users", routName: "users" }],
        },
      },

      {
        name: "machine",
        path: "/machine",
        component: () => import("pages/main/machine/Machine.vue"),
        meta: {
          moduleName: "Machines",
          breadcrumbs: [
            { label: "Tools Plants & Machine", routName: "machine" },
          ],
        },
      },

      {
        name: "payment",
        path: "/payment",
        component: () => import("pages/main/payment/Payment.vue"),
        meta: {
          moduleName: "Payments",
          breadcrumbs: [{ label: "Payments", routName: "payment" }],
        },
      },
      {
        name: "createPaymentNew",
        path: "/create_payment",
        component: () => import("pages/main/payment/CreatePayment.vue"),
        meta: {
          moduleName: "Payments",
          breadcrumbs: [
            { label: "Payments", routName: "payment" },
            { label: "Create Payments", routName: "create_payment" },
          ],
        },
      },
      {
        name: "paymentDraft",
        path: "/payment_draft",
        component: () => import("pages/main/payment/PaymentDraft.vue"),
        meta: {
          moduleName: "Payments",
          breadcrumbs: [
            { label: "Payments", routName: "payment" },
            { label: "Payment Drafts", routName: "payment_draft" },
          ],
        },
      },
      {
        name: "paymentApprovals",
        path: "/payments_approvals",
        component: () => import("pages/main/payment/Approvals.vue"),
        meta: {
          moduleName: "Payments",
          breadcrumbs: [
            { label: "Payments", routName: "payment" },
            { label: "Approvals", routName: "payments_approvals" },
          ],
        },
      },
      {
        name: "paymentHistory",
        path: "/payments",
        component: () => import("pages/main/payment/PaymentHistory.vue"),
        meta: {
          moduleName: "Payments",
          breadcrumbs: [
            { label: "Payments", routName: "payment" },
            { label: "History", routName: "payments" },
          ],
        },
      },

      {
        name: "accountStore",
        path: "/account_store",
        component: () => import("pages/main/account-store/AccountStore.vue"),
        meta: {
          moduleName: "WebAccounts",
          breadcrumbs: [{ label: "Web-Accounts", routName: "account_store" }],
        },
      },
      {
        name: "notification",
        path: "/notifications",
        component: () => import("pages/main/notification/Notifications.vue"),
      },

      {
        name: "drive",
        path: "/drive",
        component: () => import("pages/main/drive/Drive.vue"),
        meta: {
          moduleName: "Storage",
          breadcrumbs: [{ label: "Drive", routName: "drive" }],
        },
      },
      {
        name: "directoryFiles",
        path: "/directory_files",
        component: () => import("src/pages/main/drive/DirectoryFiles.vue"),
        meta: {
          moduleName: "Storage",
          breadcrumbs: [
            { label: "Drive", routName: "drive" },
            { label: "Files", routName: "directory_files" },
          ],
        },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("layouts/LoginLayout.vue"),
    children: [],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
