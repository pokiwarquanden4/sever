import userRoutes from "./userRoutes.js";

const routes = (app) => {
  app.use("/users", userRoutes);
};

export default routes;
