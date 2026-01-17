interface HttpClientConfig {
    baseURL: string;
    apiKey?: string;
    timeout?: number;
    headers?: Record<string, string>;
}
declare class HttpClient {
    private axiosInstance;
    private apiKey?;
    constructor(config: HttpClientConfig);
    setApiKey(apiKey: string): void;
    get<T>(path: string, params?: Record<string, string | number | boolean | undefined>, headers?: Record<string, string>): Promise<T>;
    post<T>(path: string, body?: unknown, params?: Record<string, string | number | boolean | undefined>): Promise<T>;
    patch<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T>;
    delete<T>(path: string, headers?: Record<string, string>): Promise<T>;
    private handleError;
}

type Color = 'grey' | 'yellow' | 'orange' | 'red' | 'pink' | 'purple' | 'blue' | 'ice' | 'teal' | 'lime';
type FilterCondition = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'ncontains' | 'in' | 'nin' | 'all' | 'empty' | 'nempty';
type FilterOperator = 'and' | 'or';
type IconFormat = 'emoji' | 'file' | 'icon';
type IconName = 'accessibility' | 'add-circle' | 'airplane' | 'alarm' | 'albums' | 'alert-circle' | 'american-football' | 'analytics' | 'aperture' | 'apps' | 'archive' | 'arrow-back-circle' | 'arrow-down-circle' | 'arrow-forward-circle' | 'arrow-redo-circle' | 'arrow-redo' | 'arrow-undo-circle' | 'arrow-undo' | 'arrow-up-circle' | 'at-circle' | 'attach' | 'backspace' | 'bag-add' | 'bag-check' | 'bag-handle' | 'bag-remove' | 'bag' | 'balloon' | 'ban' | 'bandage' | 'bar-chart' | 'barbell' | 'barcode' | 'baseball' | 'basket' | 'basketball' | 'battery-charging' | 'battery-dead' | 'battery-full' | 'battery-half' | 'beaker' | 'bed' | 'beer' | 'bicycle' | 'binoculars' | 'bluetooth' | 'boat' | 'body' | 'bonfire' | 'book' | 'bookmark' | 'bookmarks' | 'bowling-ball' | 'briefcase' | 'browsers' | 'brush' | 'bug' | 'build' | 'bulb' | 'bus' | 'business' | 'cafe' | 'calculator' | 'calendar-clear' | 'calendar-number' | 'calendar' | 'call' | 'camera-reverse' | 'camera' | 'car-sport' | 'car' | 'card' | 'caret-back-circle' | 'caret-back' | 'caret-down-circle' | 'caret-down' | 'caret-forward-circle' | 'caret-forward' | 'caret-up-circle' | 'caret-up' | 'cart' | 'cash' | 'cellular' | 'chatbox-ellipses' | 'chatbox' | 'chatbubble-ellipses' | 'chatbubble' | 'chatbubbles' | 'checkbox' | 'checkmark-circle' | 'checkmark-done-circle' | 'chevron-back-circle' | 'chevron-down-circle' | 'chevron-forward-circle' | 'chevron-up-circle' | 'clipboard' | 'close-circle' | 'cloud-circle' | 'cloud-done' | 'cloud-download' | 'cloud-offline' | 'cloud-upload' | 'cloud' | 'cloudy-night' | 'cloudy' | 'code-slash' | 'code' | 'cog' | 'color-fill' | 'color-filter' | 'color-palette' | 'color-wand' | 'compass' | 'construct' | 'contact' | 'contract' | 'contrast' | 'copy' | 'create' | 'crop' | 'cube' | 'cut' | 'desktop' | 'diamond' | 'dice' | 'disc' | 'document-attach' | 'document-lock' | 'document-text' | 'document' | 'documents' | 'download' | 'duplicate' | 'ear' | 'earth' | 'easel' | 'egg' | 'ellipse' | 'ellipsis-horizontal-circle' | 'ellipsis-vertical-circle' | 'enter' | 'exit' | 'expand' | 'extension-puzzle' | 'eye-off' | 'eye' | 'eyedrop' | 'fast-food' | 'female' | 'file-tray-full' | 'file-tray-stacked' | 'file-tray' | 'film' | 'filter-circle' | 'finger-print' | 'fish' | 'fitness' | 'flag' | 'flame' | 'flash-off' | 'flash' | 'flashlight' | 'flask' | 'flower' | 'folder-open' | 'folder' | 'football' | 'footsteps' | 'funnel' | 'game-controller' | 'gift' | 'git-branch' | 'git-commit' | 'git-compare' | 'git-merge' | 'git-network' | 'git-pull-request' | 'glasses' | 'globe' | 'golf' | 'grid' | 'hammer' | 'hand-left' | 'hand-right' | 'happy' | 'hardware-chip' | 'headset' | 'heart-circle' | 'heart-dislike-circle' | 'heart-dislike' | 'heart-half' | 'heart' | 'help-buoy' | 'help-circle' | 'home' | 'hourglass' | 'ice-cream' | 'id-card' | 'image' | 'images' | 'infinite' | 'information-circle' | 'invert-mode' | 'journal' | 'key' | 'keypad' | 'language' | 'laptop' | 'layers' | 'leaf' | 'library' | 'link' | 'list-circle' | 'list' | 'locate' | 'location' | 'lock-closed' | 'lock-open' | 'log-in' | 'log-out' | 'logo-alipay' | 'logo-amazon' | 'logo-amplify' | 'logo-android' | 'magnet' | 'mail-open' | 'mail-unread' | 'mail' | 'male-female' | 'male' | 'man' | 'map' | 'medal' | 'medical' | 'medkit' | 'megaphone' | 'menu' | 'mic-circle' | 'mic-off-circle' | 'mic-off' | 'mic' | 'moon' | 'move' | 'musical-note' | 'musical-notes' | 'navigate-circle' | 'navigate' | 'newspaper' | 'notifications-circle' | 'notifications-off-circle' | 'notifications-off' | 'notifications' | 'nuclear' | 'nutrition' | 'options' | 'paper-plane' | 'partly-sunny' | 'pause-circle' | 'pause' | 'paw' | 'pencil' | 'people-circle' | 'people' | 'person-add' | 'person-circle' | 'person-remove' | 'person' | 'phone-landscape' | 'phone-portrait' | 'pie-chart' | 'pin' | 'pint' | 'pizza' | 'planet' | 'play-back-circle' | 'play-back' | 'play-circle' | 'play-forward-circle' | 'play-forward' | 'play-skip-back-circle' | 'play-skip-back' | 'play-skip-forward-circle' | 'play-skip-forward' | 'play' | 'podium' | 'power' | 'pricetag' | 'pricetags' | 'print' | 'prism' | 'pulse' | 'push' | 'qr-code' | 'radio-button-off' | 'radio-button-on' | 'radio' | 'rainy' | 'reader' | 'receipt' | 'recording' | 'refresh-circle' | 'refresh' | 'reload-circle' | 'reload' | 'remove-circle' | 'repeat' | 'resize' | 'restaurant' | 'ribbon' | 'rocket' | 'rose' | 'sad' | 'save' | 'scale' | 'scan-circle' | 'scan' | 'school' | 'search-circle' | 'search' | 'send' | 'server' | 'settings' | 'shapes' | 'share-social' | 'share' | 'shield-checkmark' | 'shield-half' | 'shield' | 'shirt' | 'shuffle' | 'skull' | 'snow' | 'sparkles' | 'speedometer' | 'square' | 'star-half' | 'star' | 'stats-chart' | 'stop-circle' | 'stop' | 'stopwatch' | 'storefront' | 'subway' | 'sunny' | 'swap-horizontal' | 'swap-vertical' | 'sync-circle' | 'sync' | 'tablet-landscape' | 'tablet-portrait' | 'telescope' | 'tennisball' | 'terminal' | 'text' | 'thermometer' | 'thumbs-down' | 'thumbs-up' | 'thunderstorm' | 'ticket' | 'time' | 'timer' | 'today' | 'toggle' | 'trail-sign' | 'train' | 'transgender' | 'trash-bin' | 'trash' | 'trending-down' | 'trending-up' | 'triangle' | 'trophy' | 'tv' | 'umbrella' | 'unlink' | 'videocam-off' | 'videocam' | 'volume-high' | 'volume-low' | 'volume-medium' | 'volume-mute' | 'volume-off' | 'walk' | 'wallet' | 'warning' | 'watch' | 'water' | 'wifi' | 'wine' | 'woman';
type PropertyFormat = 'text' | 'number' | 'select' | 'multi_select' | 'date' | 'files' | 'checkbox' | 'url' | 'email' | 'phone' | 'objects';
type SortDirection = 'asc' | 'desc';
type SortProperty = 'created_date' | 'last_modified_date' | 'last_opened_date' | 'name';
type TypeLayout = 'basic' | 'profile' | 'action' | 'note';
type MemberRole = 'viewer' | 'editor' | 'owner' | 'no_permission';
type MemberStatus = 'joining' | 'active' | 'removed' | 'declined' | 'removing' | 'canceled';
interface CreateApiKeyRequest {
    challenge_id: string;
    code: string;
}
interface CreateApiKeyResponse {
    api_key: string;
}
interface CreateChallengeRequest {
    app_name: string;
}
interface CreateChallengeResponse {
    challenge_id: string;
}
interface CreateObjectRequest {
    type_key: string;
    name?: string;
    body?: string;
    icon?: Icon;
    template_id?: string;
    properties?: PropertyLinkWithValue[];
}
interface CreatePropertyRequest {
    format: PropertyFormat;
    name: string;
    key?: string;
    tags?: CreateTagRequest[];
}
interface CreateSpaceRequest {
    name: string;
    description?: string;
}
interface CreateTagRequest {
    name: string;
    color: Color;
    key?: string;
}
interface CreateTypeRequest {
    layout: TypeLayout;
    name: string;
    plural_name: string;
    icon?: Icon;
    key?: string;
    properties?: PropertyLink[];
}
interface UpdateObjectRequest {
    name?: string;
    markdown?: string;
    icon?: Icon;
    type_key?: string;
    properties?: PropertyLinkWithValue[];
}
interface UpdatePropertyRequest {
    name: string;
    key?: string;
}
interface UpdateSpaceRequest {
    name?: string;
    description?: string;
}
interface UpdateTagRequest {
    name?: string;
    color?: Color;
    key?: string;
}
interface UpdateTypeRequest {
    name?: string;
    plural_name?: string;
    layout?: TypeLayout;
    icon?: Icon;
    key?: string;
    properties?: PropertyLink[];
}
interface SearchRequest {
    query?: string;
    types?: string[];
    sort?: SortOptions;
    filters?: FilterExpression;
}
interface SortOptions {
    property_key?: SortProperty;
    direction?: SortDirection;
}
interface FilterExpression {
    operator?: FilterOperator;
    conditions?: FilterItem[];
    filters?: FilterExpression[];
}
type FilterItem = TextFilterItem | NumberFilterItem | SelectFilterItem | MultiSelectFilterItem | DateFilterItem | CheckboxFilterItem | FilesFilterItem | UrlFilterItem | EmailFilterItem | PhoneFilterItem | ObjectsFilterItem | EmptyFilterItem;
interface TextFilterItem {
    property_key: string;
    text: string;
    condition: FilterCondition;
}
interface NumberFilterItem {
    property_key: string;
    number: number;
    condition: FilterCondition;
}
interface SelectFilterItem {
    property_key: string;
    select: string;
    condition: FilterCondition;
}
interface MultiSelectFilterItem {
    property_key: string;
    multi_select: string[];
    condition: FilterCondition;
}
interface DateFilterItem {
    property_key: string;
    date: string;
    condition: FilterCondition;
}
interface CheckboxFilterItem {
    property_key: string;
    checkbox: boolean;
    condition: FilterCondition;
}
interface FilesFilterItem {
    property_key: string;
    files: string[];
    condition: FilterCondition;
}
interface UrlFilterItem {
    property_key: string;
    url: string;
    condition: FilterCondition;
}
interface EmailFilterItem {
    property_key: string;
    email: string;
    condition: FilterCondition;
}
interface PhoneFilterItem {
    property_key: string;
    phone: string;
    condition: FilterCondition;
}
interface ObjectsFilterItem {
    property_key: string;
    objects: string[];
    condition: FilterCondition;
}
interface EmptyFilterItem {
    property_key: string;
    condition: FilterCondition;
}
interface AddObjectsToListRequest {
    objects: string[];
}
interface PropertyLink {
    format: PropertyFormat;
    key: string;
    name: string;
}
type PropertyLinkWithValue = TextPropertyLinkValue | NumberPropertyLinkValue | SelectPropertyLinkValue | MultiSelectPropertyLinkValue | DatePropertyLinkValue | FilesPropertyLinkValue | CheckboxPropertyLinkValue | UrlPropertyLinkValue | EmailPropertyLinkValue | PhonePropertyLinkValue | ObjectsPropertyLinkValue;
interface TextPropertyLinkValue {
    key: string;
    text: string;
}
interface NumberPropertyLinkValue {
    key: string;
    number: number;
}
interface SelectPropertyLinkValue {
    key: string;
    select: string;
}
interface MultiSelectPropertyLinkValue {
    key: string;
    multi_select: string[];
}
interface DatePropertyLinkValue {
    key: string;
    date: string;
}
interface FilesPropertyLinkValue {
    key: string;
    files: string[];
}
interface CheckboxPropertyLinkValue {
    key: string;
    checkbox: boolean;
}
interface UrlPropertyLinkValue {
    key: string;
    url: string;
}
interface EmailPropertyLinkValue {
    key: string;
    email: string;
}
interface PhonePropertyLinkValue {
    key: string;
    phone: string;
}
interface ObjectsPropertyLinkValue {
    key: string;
    objects: string[];
}
interface Icon {
    format: IconFormat;
}
interface EmojiIcon extends Icon {
    format: 'emoji';
    emoji: string;
}
interface FileIcon extends Icon {
    format: 'file';
    file: string;
}
interface NamedIcon extends Icon {
    format: 'icon';
    name: IconName;
    color?: Color;
}
interface Tag {
    id: string;
    key: string;
    name: string;
    color: Color;
    object: string;
}
interface Property {
    id: string;
    key: string;
    name: string;
    format: PropertyFormat;
    object: string;
}
type PropertyWithValue = TextPropertyValue | NumberPropertyValue | SelectPropertyValue | MultiSelectPropertyValue | DatePropertyValue | FilesPropertyValue | CheckboxPropertyValue | UrlPropertyValue | EmailPropertyValue | PhonePropertyValue | ObjectsPropertyValue;
interface TextPropertyValue extends Property {
    text: string;
}
interface NumberPropertyValue extends Property {
    number: number;
}
interface SelectPropertyValue extends Property {
    select: Tag;
}
interface MultiSelectPropertyValue extends Property {
    multi_select: Tag[];
}
interface DatePropertyValue extends Property {
    date: string;
}
interface FilesPropertyValue extends Property {
    files: string[];
}
interface CheckboxPropertyValue extends Property {
    checkbox: boolean;
}
interface UrlPropertyValue extends Property {
    url: string;
}
interface EmailPropertyValue extends Property {
    email: string;
}
interface PhonePropertyValue extends Property {
    phone: string;
}
interface ObjectsPropertyValue extends Property {
    objects: string[];
}
interface Type {
    id: string;
    key: string;
    name: string;
    plural_name: string;
    layout: string;
    icon?: Icon;
    archived: boolean;
    properties?: Property[];
    object: string;
}
interface Object$1 {
    id: string;
    name: string;
    snippet?: string;
    archived: boolean;
    space_id: string;
    layout: string;
    icon?: Icon;
    type?: Type | null;
    properties?: PropertyWithValue[];
    object: string;
}
interface ObjectWithBody extends Object$1 {
    markdown?: string;
}
interface Space {
    id: string;
    name: string;
    description?: string;
    network_id: string;
    gateway_url: string;
    icon?: Icon;
    object: 'space' | 'chat';
}
interface Member {
    id: string;
    identity: string;
    global_name: string;
    name: string;
    icon?: Icon;
    role: MemberRole;
    status: MemberStatus;
    object: string;
}
interface View {
    id: string;
    name: string;
    layout: 'grid' | 'table';
    filters: Filter[];
    sorts: Sort[];
}
interface Filter {
    id: string;
    property_key: string;
    format: PropertyFormat;
    condition: FilterCondition;
    value: string;
}
interface Sort {
    id: string;
    property_key: string;
    format: PropertyFormat;
    sort_type: 'asc' | 'desc' | 'custom';
}
interface PaginationMeta {
    limit: number;
    offset: number;
    total: number;
    has_more: boolean;
}
interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}
interface ObjectResponse {
    object: ObjectWithBody;
}
interface SpaceResponse {
    space: Space;
}
interface PropertyResponse {
    property: Property;
}
interface TypeResponse {
    type: Type;
}
interface TagResponse {
    tag: Tag;
}
interface TemplateResponse {
    template: ObjectWithBody;
}
interface MemberResponse {
    member: Member;
}
interface ApiErrorData {
    status: number;
    object: string;
    code: string;
    message: string;
}
declare class ApiError extends Error {
    status: number;
    code: string;
    constructor(status: number, code: string, message: string);
}

declare class AuthResource {
    private httpClient;
    constructor(httpClient: HttpClient);
    createChallenge(request: CreateChallengeRequest): Promise<CreateChallengeResponse>;
    createApiKey(request: CreateApiKeyRequest): Promise<CreateApiKeyResponse>;
}

declare class SpacesResource {
    private httpClient;
    constructor(httpClient: HttpClient);
    list(params?: {
        limit?: number;
        offset?: number;
    }): Promise<PaginatedResponse<Space>>;
    get(spaceId: string): Promise<SpaceResponse>;
    create(request: CreateSpaceRequest): Promise<SpaceResponse>;
    update(spaceId: string, request: UpdateSpaceRequest): Promise<SpaceResponse>;
}

declare class ObjectsResource {
    private httpClient;
    constructor(httpClient: HttpClient);
    list(spaceId: string, params?: {
        limit?: number;
        offset?: number;
    }): Promise<PaginatedResponse<Object$1>>;
    get(spaceId: string, objectId: string): Promise<ObjectResponse>;
    create(spaceId: string, request: CreateObjectRequest): Promise<ObjectResponse>;
    update(spaceId: string, objectId: string, request: UpdateObjectRequest): Promise<ObjectResponse>;
    delete(spaceId: string, objectId: string): Promise<ObjectResponse>;
}

declare class SearchResource {
    private httpClient;
    constructor(httpClient: HttpClient);
    global(request: SearchRequest, params?: {
        limit?: number;
        offset?: number;
    }): Promise<PaginatedResponse<Object$1>>;
    inSpace(spaceId: string, request: SearchRequest, params?: {
        limit?: number;
        offset?: number;
    }): Promise<PaginatedResponse<Object$1>>;
}

declare class PropertiesResource {
    private httpClient;
    constructor(httpClient: HttpClient);
    list(spaceId: string, params?: {
        limit?: number;
        offset?: number;
    }): Promise<PaginatedResponse<Property>>;
    get(spaceId: string, propertyId: string): Promise<PropertyResponse>;
    create(spaceId: string, request: CreatePropertyRequest): Promise<PropertyResponse>;
    update(spaceId: string, propertyId: string, request: UpdatePropertyRequest): Promise<PropertyResponse>;
    delete(spaceId: string, propertyId: string): Promise<PropertyResponse>;
}

declare class TagsResource {
    private httpClient;
    constructor(httpClient: HttpClient);
    list(spaceId: string, propertyId: string): Promise<PaginatedResponse<Tag>>;
    get(spaceId: string, propertyId: string, tagId: string): Promise<TagResponse>;
    create(spaceId: string, propertyId: string, request: CreateTagRequest): Promise<TagResponse>;
    update(spaceId: string, propertyId: string, tagId: string, request: UpdateTagRequest): Promise<TagResponse>;
    delete(spaceId: string, propertyId: string, tagId: string): Promise<TagResponse>;
}

declare class TypesResource {
    private httpClient;
    constructor(httpClient: HttpClient);
    list(spaceId: string, params?: {
        limit?: number;
        offset?: number;
    }): Promise<PaginatedResponse<Type>>;
    get(spaceId: string, typeId: string): Promise<TypeResponse>;
    create(spaceId: string, request: CreateTypeRequest): Promise<TypeResponse>;
    update(spaceId: string, typeId: string, request: UpdateTypeRequest): Promise<TypeResponse>;
    delete(spaceId: string, typeId: string): Promise<TypeResponse>;
}

declare class TemplatesResource {
    private httpClient;
    constructor(httpClient: HttpClient);
    list(spaceId: string, typeId: string, params?: {
        limit?: number;
        offset?: number;
    }): Promise<PaginatedResponse<ObjectWithBody>>;
    get(spaceId: string, typeId: string, templateId: string): Promise<TemplateResponse>;
}

declare class MembersResource {
    private httpClient;
    constructor(httpClient: HttpClient);
    list(spaceId: string, params?: {
        limit?: number;
        offset?: number;
    }): Promise<PaginatedResponse<Member>>;
    get(spaceId: string, memberId: string): Promise<MemberResponse>;
}

declare class ListsResource {
    private httpClient;
    constructor(httpClient: HttpClient);
    getViews(spaceId: string, listId: string, params?: {
        limit?: number;
        offset?: number;
    }): Promise<PaginatedResponse<View>>;
    getObjects(spaceId: string, listId: string, viewId: string, params?: {
        limit?: number;
        offset?: number;
    }): Promise<PaginatedResponse<Object$1>>;
    addObjects(spaceId: string, listId: string, request: AddObjectsToListRequest): Promise<string>;
    removeObject(spaceId: string, listId: string, objectId: string): Promise<string>;
}

interface AnytypeClientConfig {
    baseURL: string;
    apiKey?: string;
    timeout?: number;
    headers?: Record<string, string>;
}
declare class AnytypeClient {
    private httpClient;
    readonly auth: AuthResource;
    readonly spaces: SpacesResource;
    readonly objects: ObjectsResource;
    readonly search: SearchResource;
    readonly properties: PropertiesResource;
    readonly tags: TagsResource;
    readonly types: TypesResource;
    readonly templates: TemplatesResource;
    readonly members: MembersResource;
    readonly lists: ListsResource;
    constructor(config: AnytypeClientConfig);
    setApiKey(apiKey: string): void;
}

export { AnytypeClient, ApiError, HttpClient };
export type { AddObjectsToListRequest, AnytypeClientConfig, ApiErrorData, CheckboxFilterItem, CheckboxPropertyLinkValue, CheckboxPropertyValue, Color, CreateApiKeyRequest, CreateApiKeyResponse, CreateChallengeRequest, CreateChallengeResponse, CreateObjectRequest, CreatePropertyRequest, CreateSpaceRequest, CreateTagRequest, CreateTypeRequest, DateFilterItem, DatePropertyLinkValue, DatePropertyValue, EmailFilterItem, EmailPropertyLinkValue, EmailPropertyValue, EmojiIcon, EmptyFilterItem, FileIcon, FilesFilterItem, FilesPropertyLinkValue, FilesPropertyValue, Filter, FilterCondition, FilterExpression, FilterItem, FilterOperator, Icon, IconFormat, IconName, Member, MemberResponse, MemberRole, MemberStatus, MultiSelectFilterItem, MultiSelectPropertyLinkValue, MultiSelectPropertyValue, NamedIcon, NumberFilterItem, NumberPropertyLinkValue, NumberPropertyValue, Object$1 as Object, ObjectResponse, ObjectWithBody, ObjectsFilterItem, ObjectsPropertyLinkValue, ObjectsPropertyValue, PaginatedResponse, PaginationMeta, PhoneFilterItem, PhonePropertyLinkValue, PhonePropertyValue, Property, PropertyFormat, PropertyLink, PropertyLinkWithValue, PropertyResponse, PropertyWithValue, SearchRequest, SelectFilterItem, SelectPropertyLinkValue, SelectPropertyValue, Sort, SortDirection, SortOptions, SortProperty, Space, SpaceResponse, Tag, TagResponse, TemplateResponse, TextFilterItem, TextPropertyLinkValue, TextPropertyValue, Type, TypeLayout, TypeResponse, UpdateObjectRequest, UpdatePropertyRequest, UpdateSpaceRequest, UpdateTagRequest, UpdateTypeRequest, UrlFilterItem, UrlPropertyLinkValue, UrlPropertyValue, View };
