const LocationMap = ({ className = "h-[260px] w-full border-0 md:h-[320px]" }) => {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3546.7433593101155!2d33.82320497610272!3d27.258577245140547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14528756b4e5a9a7%3A0x4f65db9fe1cfb206!2sPlan%20B%20Caf%C3%A9%20%26%20Restaurant!5e0!3m2!1sen!2seg!4v1770929441479!5m2!1sen!2seg"
      className={className}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Plan B Restaurant Location"
    ></iframe>
  );
};

export default LocationMap;
