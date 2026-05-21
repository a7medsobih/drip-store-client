import {
  DashboardAction,
  DashboardNavigationSection,
  DashboardQuickAction,
  DashboardStat,
  DashboardTableConfig,
} from './dashboard.models';

const blazerImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAlDx2lWZtKtCaO9o0c0Aoo7SQXx8BE42PAbaec5TfRbt_5Q_HuNvADM2_Gn9a3mG_4K_JZsCfFjA1mbZtDPssfjrTwcExXvnIEu5qvOjr4tB8wjZqzNInEdesOy4U7oElaOtlrLUC3jIfX0swbrRemqAW72pB6z9X5yzX9UL8cwIxm5hkxHr9SCWd7IVjEd9KH0FQfdIDPT_lsSzEd1UKJCcbij8tXp0hNl6Ex6cIDL1yQmlNJw230ErZUZcSuz1bWsYB8YE5k-58';
const ceramicImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCz2Jn8PkJOxFFMhEn8nwawdtWRSMtnMgrzjx99rlHTflOYgat1SwNLC7qlhCxIdOqZj4VZlCIGpjPuXdXzK391JlhlsY13QpXDhhZQVYcsZSbIATBLs0ZsoVS89wg1nP1BjnEiVmUOwiBBEtmfbpChSHcSbQ_L7HGwfRqedWs71qRviH7KsB8VmYWUC_WREaaYxucvOWuYNt67gnf37NVz87Coarka0e_mdYq-sJpIwqZvH56s16drDVdm4vIAmD-R9X5se7HFUMc';
const teeImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAT7msVO9kYXKrBXSt39y2fxRExMKgxseKEUzr4c5QrYTl79mngIjoZzy3DAKLDs8KD3b9Zsqif6evw-xBKg5CUP8bMmaOgm5sy_bE2C_li1oGedH9vsaK6gEBy6WKbF2RqAPnvJ-Ko0K1dlH8NlrtFeKGv-Nj3rUp-tZK1AO_hBWSQx-rgNv-txEls-SvoDVBtZDV1i8sf9gQls9jYeZmsD7uqGqsqMe2dTtC-ZzSFByZrLF5Kca2mZql3m47jgdfvA4-WecPPS5E';
const sneakerImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAqAhuJq3-ZFKVO5rlBPN4FU37Hk1uzEBwNckq-Qxusf4pP35lGEVe_O-6wGPPb68CU5AU0KqtFSx-Xq_Ri-5dalYF8JDdkmu7UpFS51HgG5kIeXOFHdThfd7XuOQFG3SK0SvX6dpvbS6wgmSTmWH6mTfnAfZqbspGzVfNgwRrs5iRgTv3HC12cHbVQNHzZ5sOl7OT_GXuRVeD1hf_E1buNC6VEJdFIcx0Tcrbi4aqxDL8nPW3CH3-xlnimSURVgiQZbWw7Ry3L0H0';
const toteImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBc00wvk-Iaddzu4cjfcE8JVVle9XUku90i5SV1zKSAQLdSeFy3Vzh5XK1HA7tFsZ08jvPmuwBgq4yxOacH5XqyI0RLCytZNqfQhx_UdyEWC4V_WF9Q8QsYzC6M6XLExlr4AixhvNIhtmDj_cBNqZnrhcea6uIuWW6iGY50D_xlqEE_V7nvzN3xRyQ1Nk9R1QSabY-3bPHlxj4iprDBhxelMk3m421j6BWFIJ9Mi2Gxu1EQFm1gaKT_K-X6idK-XFWrb6oByHxuJFc';
const avatarImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCQPYqWsj5NOUKhvmDmjeL63xsp_N1MRW5WqG2qYVP3mjYD6oJaKNBLYiHg-tthvzdOhYxCtoCgdY3RYyur13e_UmvTqqhYkcHyz-wSFYBggdsWu7HB8HDlGLiA2yvGydebXByg_BFdNySVRi50BzLE-VJrFEoaMiVqgLVExYgZpDaZDuvRS9xwgXZNH405P1CUhYVZHPFL-3sLdnmQlD8T_eQI-CFikWUop2shoqiSoJ96zhMi1MLBCYA7Yd7baz3fnQPzoS_34-k';

export const DASHBOARD_NAVIGATION: DashboardNavigationSection[] = [
  {
    title: 'Workspace',
    items: [
      {
        label: 'Overview',
        route: '/dashboard/overview',
        icon: 'grid_view',
        exact: true,
      },
      {
        label: 'Orders',
        route: '/dashboard/orders',
        icon: 'shopping_bag',
      },
      {
        label: 'Users',
        route: '/dashboard/users',
        icon: 'group',
      },
    ],
  },
  {
    title: 'Catalog',
    items: [
      {
        label: 'Products',
        route: '/dashboard/products',
        icon: 'inventory_2',
      },
      {
        label: 'Categories',
        route: '/dashboard/categories',
        icon: 'category',
      },
    ],
  },
];

export const DASHBOARD_PROFILE = {
  name: 'Alex Rivera',
  role: 'Lead Stylist',
  image: avatarImage,
};

export const OVERVIEW_HEADER_ACTIONS: DashboardAction[] = [
  { label: 'Generate Report', variant: 'secondary', icon: 'description' },
  { label: 'New Listing', variant: 'primary', icon: 'add', route: '/dashboard/products' },
];

export const OVERVIEW_STATS: DashboardStat[] = [
  { id: 'revenue', label: 'Total Revenue', value: '$128,430', change: '+12.5%', icon: 'payments' },
  { id: 'orders', label: 'Active Orders', value: '482', change: '+8%', icon: 'shopping_bag' },
  { id: 'customers', label: 'New Customers', value: '1,204', change: '+22%', icon: 'group' },
  { id: 'conversion', label: 'Conversion', value: '4.8%', change: '+3.2%', icon: 'trending_up' },
];

export const OVERVIEW_ORDERS_TABLE: DashboardTableConfig = {
  columns: [
    { key: 'orderId', label: 'Order ID' },
    { key: 'product', label: 'Product' },
    { key: 'status', label: 'Status' },
    { key: 'amount', label: 'Amount', align: 'right' },
  ],
  rows: [
    {
      id: 'drp-9201',
      orderId: { type: 'text', value: '#DRP-9201' },
      product: { type: 'image', title: 'Linen Essential Blazer', image: blazerImage },
      status: { type: 'badge', label: 'Shipped', tone: 'primary' },
      amount: { type: 'text', value: '$295.00' },
    },
    {
      id: 'drp-9202',
      orderId: { type: 'text', value: '#DRP-9202' },
      product: { type: 'image', title: 'Artisan Ceramic Set', image: ceramicImage },
      status: { type: 'badge', label: 'Pending', tone: 'secondary' },
      amount: { type: 'text', value: '$112.00' },
    },
    {
      id: 'drp-9203',
      orderId: { type: 'text', value: '#DRP-9203' },
      product: { type: 'image', title: 'Heavyweight Tee', image: teeImage },
      status: { type: 'badge', label: 'Shipped', tone: 'primary' },
      amount: { type: 'text', value: '$65.00' },
    },
    {
      id: 'drp-9204',
      orderId: { type: 'text', value: '#DRP-9204' },
      product: { type: 'image', title: 'Sculptural Sneaker', image: sneakerImage },
      status: { type: 'badge', label: 'Cancelled', tone: 'danger' },
      amount: { type: 'text', value: '$420.00' },
    },
  ],
};

export const OVERVIEW_STOCK_ALERTS = [
  { id: 'silk-scarf', label: 'Silk Scarf - Sand', stockLabel: '2 left', progress: 10 },
  { id: 'minimal-shirt', label: 'Minimal Shirt - Chalk', stockLabel: '5 left', progress: 24 },
  { id: 'cotton-set', label: 'Cotton Set - Pearl', stockLabel: '7 left', progress: 32 },
];

export const OVERVIEW_TOP_PRODUCT = {
  title: 'Structured Tote',
  subtitle: '124 units sold this week',
  image: toteImage,
};

export const OVERVIEW_QUICK_ACTIONS: DashboardQuickAction[] = [
  {
    id: 'inventory',
    eyebrow: 'Operations',
    title: 'Review low stock products',
    description: 'Jump directly into inventory checks before the next campaign starts.',
    icon: 'inventory_2',
    actionLabel: 'Open products',
    route: '/dashboard/products',
  },
  {
    id: 'orders',
    eyebrow: 'Fulfillment',
    title: 'Follow pending orders',
    description: 'Keep today shipments moving by resolving unconfirmed and delayed orders.',
    icon: 'package_2',
    actionLabel: 'Open orders',
    route: '/dashboard/orders',
  },
];

export const PRODUCT_HEADER_ACTIONS: DashboardAction[] = [
  { label: 'Sync Catalog', variant: 'secondary', icon: 'sync' },
  { label: 'Add Product', variant: 'primary', icon: 'add' },
];

export const PRODUCT_QUICK_ACTIONS: DashboardQuickAction[] = [
  {
    id: 'imports',
    eyebrow: 'Catalog Ops',
    title: 'Prepare next collection',
    description: 'Create placeholders for the new arrivals drop and keep assets aligned.',
    icon: 'auto_awesome',
    actionLabel: 'Go to overview',
    route: '/dashboard/overview',
  },
  {
    id: 'categories',
    eyebrow: 'Structure',
    title: 'Review category mapping',
    description: 'Keep product-to-category mapping clean before publishing new inventory.',
    icon: 'category',
    actionLabel: 'Open categories',
    route: '/dashboard/categories',
  },
];

export const CATEGORIES_HEADER_ACTIONS: DashboardAction[] = [
  { label: 'Export Categories', variant: 'secondary', icon: 'download' },
  { label: 'Add Category', variant: 'primary', icon: 'add' },
];

export const CATEGORIES_STATS: DashboardStat[] = [
  { id: 'categories', label: 'Live Categories', value: '11', change: '+2', icon: 'category' },
  { id: 'subcategories', label: 'Subcategories', value: '26', change: '+4', icon: 'schema' },
  { id: 'hidden', label: 'Hidden Groups', value: '2', change: 'Needs review', icon: 'visibility_off' },
  { id: 'featured', label: 'Featured Collections', value: '5', change: 'Homepage ready', icon: 'star' },
];

export const CATEGORIES_TABLE: DashboardTableConfig = {
  columns: [
    { key: 'name', label: 'Category' },
    { key: 'items', label: 'Items', align: 'right' },
    { key: 'status', label: 'Status' },
    { key: 'trend', label: 'Trend', align: 'right' },
  ],
  rows: [
    {
      id: 'outerwear',
      name: { type: 'text', value: 'Outerwear', secondary: 'Blazers, coats, overshirts', tone: 'primary' },
      items: { type: 'text', value: '84' },
      status: { type: 'badge', label: 'Featured', tone: 'primary' },
      trend: { type: 'text', value: '+18%' },
    },
    {
      id: 'footwear',
      name: { type: 'text', value: 'Footwear', secondary: 'Sneakers and formal essentials', tone: 'primary' },
      items: { type: 'text', value: '42' },
      status: { type: 'badge', label: 'Stable', tone: 'neutral' },
      trend: { type: 'text', value: '+6%' },
    },
    {
      id: 'accessories',
      name: { type: 'text', value: 'Accessories', secondary: 'Bags, scarves, jewelry', tone: 'primary' },
      items: { type: 'text', value: '63' },
      status: { type: 'badge', label: 'Growing', tone: 'secondary' },
      trend: { type: 'text', value: '+14%' },
    },
    {
      id: 'home',
      name: { type: 'text', value: 'Home Objects', secondary: 'Ceramics, decor, curated pieces', tone: 'primary' },
      items: { type: 'text', value: '27' },
      status: { type: 'badge', label: 'Review', tone: 'danger' },
      trend: { type: 'text', value: '-2%' },
    },
  ],
};

export const CATEGORY_QUICK_ACTIONS: DashboardQuickAction[] = [
  {
    id: 'homepage',
    eyebrow: 'Merchandising',
    title: 'Refresh featured collections',
    description: 'Rotate homepage category focus before the next newsletter goes live.',
    icon: 'view_carousel',
    actionLabel: 'Open overview',
    route: '/dashboard/overview',
  },
  {
    id: 'users',
    eyebrow: 'Access',
    title: 'Align curator ownership',
    description: 'Make sure each category has a clear owner for publishing and QA.',
    icon: 'group',
    actionLabel: 'Open users',
    route: '/dashboard/users',
  },
];

export const ORDERS_HEADER_ACTIONS: DashboardAction[] = [
  { label: 'Download CSV', variant: 'secondary', icon: 'download' },
  { label: 'Create Order', variant: 'primary', icon: 'add' },
];

export const ORDERS_STATS: DashboardStat[] = [
  { id: 'pending', label: 'Pending Review', value: '38', change: '+6 today', icon: 'schedule' },
  { id: 'packed', label: 'Packed Orders', value: '54', change: 'Warehouse ready', icon: 'inventory' },
  { id: 'shipping', label: 'Out For Delivery', value: '19', change: '+4 routes', icon: 'local_shipping' },
  { id: 'returns', label: 'Return Requests', value: '7', change: 'Watch closely', icon: 'assignment_return' },
];

export const ORDERS_TABLE: DashboardTableConfig = {
  columns: [
    { key: 'orderId', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'status', label: 'Status' },
    { key: 'amount', label: 'Amount', align: 'right' },
  ],
  rows: [
    {
      id: 'ord-1',
      orderId: { type: 'text', value: '#DRP-9310' },
      customer: { type: 'text', value: 'Mina Adel', secondary: 'Cairo, Egypt' },
      status: { type: 'badge', label: 'Processing', tone: 'secondary' },
      amount: { type: 'text', value: '$180.00' },
    },
    {
      id: 'ord-2',
      orderId: { type: 'text', value: '#DRP-9311' },
      customer: { type: 'text', value: 'Lena Hassan', secondary: 'Giza, Egypt' },
      status: { type: 'badge', label: 'Shipped', tone: 'primary' },
      amount: { type: 'text', value: '$245.00' },
    },
    {
      id: 'ord-3',
      orderId: { type: 'text', value: '#DRP-9312' },
      customer: { type: 'text', value: 'Omar Karim', secondary: 'Alexandria, Egypt' },
      status: { type: 'badge', label: 'Payment Hold', tone: 'danger' },
      amount: { type: 'text', value: '$96.00' },
    },
    {
      id: 'ord-4',
      orderId: { type: 'text', value: '#DRP-9313' },
      customer: { type: 'text', value: 'Sarah Fawzy', secondary: 'Mansoura, Egypt' },
      status: { type: 'badge', label: 'Delivered', tone: 'neutral' },
      amount: { type: 'text', value: '$410.00' },
    },
  ],
};

export const USERS_HEADER_ACTIONS: DashboardAction[] = [
  { label: 'Invite Team', variant: 'secondary', icon: 'mail' },
  { label: 'Add User', variant: 'primary', icon: 'person_add' },
];

export const USERS_STATS: DashboardStat[] = [
  { id: 'admins', label: 'Admin Users', value: '12', change: '+1 this month', icon: 'shield_person' },
  { id: 'staff', label: 'Operations Staff', value: '34', change: '2 on leave', icon: 'badge' },
  { id: 'stylists', label: 'Curators', value: '9', change: 'Fully staffed', icon: 'styler' },
  { id: 'inactive', label: 'Pending Access', value: '3', change: 'Need approval', icon: 'lock_clock' },
];

export const USERS_TABLE: DashboardTableConfig = {
  columns: [
    { key: 'user', label: 'User' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'activity', label: 'Last Active', align: 'right' },
  ],
  rows: [
    {
      id: 'user-1',
      user: { type: 'image', title: 'Alex Rivera', subtitle: 'alex@drip-store.com', image: avatarImage },
      role: { type: 'text', value: 'Lead Stylist' },
      status: { type: 'badge', label: 'Active', tone: 'primary' },
      activity: { type: 'text', value: '2 min ago' },
    },
    {
      id: 'user-2',
      user: { type: 'text', value: 'Mariam Soliman', secondary: 'mariam@drip-store.com', tone: 'primary' },
      role: { type: 'text', value: 'Catalog Manager' },
      status: { type: 'badge', label: 'Pending', tone: 'secondary' },
      activity: { type: 'text', value: '1 hour ago' },
    },
    {
      id: 'user-3',
      user: { type: 'text', value: 'Youssef Nader', secondary: 'youssef@drip-store.com', tone: 'primary' },
      role: { type: 'text', value: 'Fulfillment Lead' },
      status: { type: 'badge', label: 'Active', tone: 'primary' },
      activity: { type: 'text', value: 'Today' },
    },
    {
      id: 'user-4',
      user: { type: 'text', value: 'Nour Hatem', secondary: 'nour@drip-store.com', tone: 'primary' },
      role: { type: 'text', value: 'Support Specialist' },
      status: { type: 'badge', label: 'Suspended', tone: 'danger' },
      activity: { type: 'text', value: '3 days ago' },
    },
  ],
};
