// Notification Enum
export type NotificationTypeEnum =
    | 'SYSTEM_MAINTENANCE'
    | 'SYSTEM_UPDATE'
    | 'WELCOME'
    | 'PASSWORD_RESET'
    | 'PASSWORD_CHANGED'
    | 'ACCOUNT_VERIFIED'
    | 'ROLE_ASSIGNED'
    | 'PROFILE_UPDATED'
    | 'USER_UPDATED'
    | 'USER_DELETED'
    | 'VEHICLE_CREATED'
    | 'VEHICLE_UPDATED'
    | 'VEHICLE_DELETED'
    | 'VEHICLE_PARTED_OUT'
    | 'PART_CREATED'
    | 'PART_UPDATED'
    | 'PART_DELETED'
    | 'PART_SOLD'
    | 'PART_LOW_STOCK'
    | 'ORDER_CREATED'
    | 'ORDER_UPDATED'
    | 'ORDER_COMPLETED'
    | 'ORDER_CANCELLED'
    | 'REPORT_GENERATED'
    | 'REPORT_READY'
    | 'CATEGORY_CREATED'
    | 'CATEGORY_UPDATED'
    | 'CATEGORY_DELETED'
    | 'REORDER_CATEGORIES';

export type UserRoleEnum = 'ADMIN' | 'MANAGER' | 'DEV' | 'SALES' | 'STAFF' | 'CUSTOMER' | 'UNKNOWN';

export type SortOrder = 'ASC' | 'DESC';

export type OrderStatusEnum = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

export type DeliveryMethodEnum = 'PICKUP' | 'SHIPPING';
