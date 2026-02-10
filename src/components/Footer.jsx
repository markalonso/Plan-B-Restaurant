import { motion } from "framer-motion";
import { revealVariants, viewportConfig } from "../lib/motion.js";

const Footer = () => {
  return (
    <motion.footer 
      className="border-t border-coffee/10 bg-white"
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 text-sm text-text-secondary md:grid-cols-3">
        <div>
          <p className="text-base font-semibold text-text-primary">Plan B</p>
          <p className="mt-2">Premium restaurant & cafe in Hurghada.</p>
        </div>
        <div>
          <p className="font-semibold text-text-primary">Hours</p>
          <p className="mt-2">Daily 09:00 – 02:00</p>
        </div>
        <div>
          <p className="font-semibold text-text-primary">Location</p>
          <p className="mt-2">Hurghada, Cornish Street, Gold Star Mall</p>
          <a
            className="mt-3 inline-flex items-center gap-2 text-coffee transition-colors hover:text-coffee-dark"
            href="https://wa.me/201005260787"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp +20 100 526 0787
          </a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
