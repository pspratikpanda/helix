import React from 'react';

const NotificationItem = ({ notification, onClick }) => {
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      onClick={onClick}
      className="p-3 border-b border-ocean/50 hover:bg-ocean/30 transition-colors duration-200 cursor-pointer flex flex-col gap-1 text-left"
    >
      <div className="flex items-center justify-between">
        <span className="font-heading text-xs font-bold text-gold tracking-wide">
          {notification.title}
        </span>
        <span className="text-[10px] text-seafoam/70">
          {formatDate(notification.createdAt)}
        </span>
      </div>
      <p className="text-xs text-white/90 font-body leading-relaxed">
        {notification.message}
      </p>
      {notification.eventRef && (
        <span className="self-start mt-1 text-[10px] bg-baltic/30 border border-baltic/50 text-mint px-1.5 py-0.5 rounded font-body uppercase">
          ⚓ Voyage: {notification.eventRef.title}
        </span>
      )}
    </div>
  );
};

export default NotificationItem;
