const POSHeader = ({ businessDay, onShowQROrders, onShowBusinessDay, qrOrderCount }) => {
  return (
    <header className="border-b border-coffee/15 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Point of Sale</h1>
          <p className="text-sm text-text-secondary">
            {businessDay ? (
              <span className="text-green-600">
                Business Day Open - {new Date(businessDay.opened_at).toLocaleDateString()}
              </span>
            ) : (
              <span className="text-red-600">Business Day Closed</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* QR Orders Badge */}
          <button
            onClick={onShowQROrders}
            className="relative rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
          >
            QR Orders
            {qrOrderCount > 0 && (
              <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                {qrOrderCount}
              </span>
            )}
          </button>

          {/* Business Day Button */}
          <button
            onClick={onShowBusinessDay}
            className="rounded-lg bg-coffee px-4 py-2 text-sm font-semibold text-white hover:bg-coffee/90"
          >
            Business Day
          </button>
        </div>
      </div>
    </header>
  );
};

export default POSHeader;
