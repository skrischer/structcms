export {
  StructCMSAdminApp,
  type StructCMSAdminAppProps,
  type View,
} from './components/app/struct-cms-admin-app';
export {
  AdminProvider,
  type AdminProviderProps,
  type AdminContextValue,
} from './context/admin-context';
export { useAdmin } from './hooks/use-admin';
export {
  useApiClient,
  type ApiClient,
  type ApiResponse,
  type ApiError,
} from './hooks/use-api-client';

export { AuthProvider, useAuth } from './context/auth-context';
export type {
  AuthContextValue,
  AuthProviderProps,
} from './context/auth-context';

export { LoginForm, ProtectedRoute, OAuthButton } from './components/auth';
export type {
  LoginFormProps,
  ProtectedRouteProps,
  OAuthButtonProps,
} from './components/auth';

export { Input, type InputProps } from './components/ui/input';
export { Textarea, type TextareaProps } from './components/ui/textarea';
export { Label, type LabelProps } from './components/ui/label';
export {
  Button,
  type ButtonProps,
  buttonVariants,
} from './components/ui/button';
export {
  FormGenerator,
  type FormGeneratorProps,
  resolveFieldType,
  fieldNameToLabel,
} from './components/forms/form-generator';
export {
  SectionEditor,
  type SectionEditorProps,
} from './components/editors/section-editor';
export {
  PageEditor,
  type PageEditorProps,
} from './components/editors/page-editor';
export {
  PageList,
  type PageListProps,
  type PageSummary,
} from './components/content/page-list';
export {
  NavigationEditor,
  type NavigationEditorProps,
} from './components/content/navigation-editor';
export {
  MediaBrowser,
  type MediaBrowserProps,
  type MediaItem,
} from './components/media/media-browser';
export {
  AdminLayout,
  type AdminLayoutProps,
  type SidebarNavItem,
} from './components/layout/admin-layout';
export {
  Sidebar,
  type SidebarProps,
  type SidebarNavItem as SidebarItem,
} from './components/layout/sidebar';
export { HeaderBar, type HeaderBarProps } from './components/layout/header-bar';
export { Skeleton, type SkeletonProps } from './components/ui/skeleton';
export {
  ToastProvider,
  useToast,
  ToastItem,
  type ToastProviderProps,
  type ToastItemProps,
  type Toast,
  type ToastVariant,
} from './components/ui/toast';
export {
  ErrorBoundary,
  type ErrorBoundaryProps,
} from './components/ui/error-boundary';
export { ErrorAlert, type ErrorAlertProps } from './components/ui/error-alert';
export { Dialog, type DialogProps } from './components/ui/dialog';
export {
  DashboardPage,
  type DashboardPageProps,
} from './components/dashboard/dashboard-page';
export {
  QuickActions,
  type QuickActionsProps,
} from './components/dashboard/quick-actions';
export { KpiCards, type KpiCardsProps } from './components/dashboard/kpi-cards';
export {
  RecentPages,
  type RecentPagesProps,
} from './components/dashboard/recent-pages';
export { Badge, type BadgeProps, badgeVariants } from './components/ui/badge';
export {
  Breadcrumb,
  type BreadcrumbProps,
  type BreadcrumbItem,
} from './components/ui/breadcrumb';
export { Checkbox, type CheckboxProps } from './components/ui/checkbox';
export { Toggle, type ToggleProps } from './components/ui/toggle';
export {
  Select,
  type SelectProps,
  type SelectOption,
} from './components/ui/select';
export {
  DataTable,
  type DataTableProps,
  type Column,
} from './components/ui/data-table';
export { Pagination, type PaginationProps } from './components/ui/pagination';
export { Card, type CardProps, cardVariants } from './components/ui/card';
export { EmptyState, type EmptyStateProps } from './components/ui/empty-state';
export { TagInput, type TagInputProps } from './components/ui/tag-input';
export { RadioGroup, type RadioGroupProps } from './components/ui/radio-group';
export { FieldGroup, type FieldGroupProps } from './components/ui/field-group';
export {
  ActionFooter,
  type ActionFooterProps,
} from './components/ui/action-footer';
export {
  FieldMessage,
  type FieldMessageProps,
} from './components/ui/field-message';
export {
  DesignSystemPage,
  type DesignSystemPageProps,
} from './components/design-system/design-system-page';
export { cn } from './lib/utils';
