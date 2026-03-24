import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import SidebarNav from "./SidebarNav";
import Header from "./Header";

export default function AppShell() {
  const { pathname } = useLocation();

  return (
    <Box sx={{ display: "flex", bgcolor: "#131313", minHeight: "100vh" }}>
      <SidebarNav />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <Box component="main" className="app-main" sx={{ ml: "256px", pt: "64px", px: 4, pb: 6 }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              className="route-enter"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}
