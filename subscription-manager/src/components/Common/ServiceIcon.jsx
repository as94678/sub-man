// 服務 Icon 組件 - 根據服務名稱顯示對應的品牌 icon

import { getServiceById, SUBSCRIPTION_SERVICES } from '../../data/subscriptionServices';

const ServiceIcon = ({ 
  serviceName, 
  color = '#3B82F6', 
  size = 'md',
  className = '' 
}) => {
  // 尺寸映射
  const sizeClasses = {
    xs: 'w-4 h-4 text-xs',
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-base',
    lg: 'w-10 h-10 text-lg',
    xl: 'w-12 h-12 text-xl'
  };

  // 根據服務名稱尋找對應的服務資料
  const findServiceByName = (name) => {
    return SUBSCRIPTION_SERVICES.find(service => 
      service.name.toLowerCase() === name.toLowerCase() ||
      service.name.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(service.name.toLowerCase())
    );
  };

  const service = findServiceByName(serviceName);
  const iconColor = service?.color || color;
  const icon = service?.icon || 'fas fa-mobile-alt'; // 預設 icon

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-lg 
        flex 
        items-center 
        justify-center 
        font-medium
        ${className}
      `}
      style={{ 
        backgroundColor: `${iconColor}15`,
        color: iconColor,
        border: `1px solid ${iconColor}30`
      }}
      title={serviceName}
    >
      <i className={icon}></i>
    </div>
  );
};

export default ServiceIcon;