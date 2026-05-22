const app : Application = express();
import  ogrenciRoutes from "./routes/ogrenci.routes";
import { notFoundError } from './middleware/error.middleware';
import { errorHandler, notFoundError } from './middleware/error.middleware';
import { logger } from './middleware/logger.middleware';

app.use(express.json());


app.use(logger);

app.get("/health",(_req,res) => {
    res.status(200).json({
        success:true,
        status:"working",
        time: new Date().toISOString(),
    });
});

app.use("/api/ogrenciler",ogrenciRoutes);

//bulunamayan route lar için
app.use(notFoundError);

//genel hatalar için
app.use(errorHandler)

export default app;