import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center bg-arifa-warm-white">
        <div className="text-center px-6">
          <p className="font-display text-8xl md:text-9xl font-light text-arifa-teal/20">404</p>
          <h1 className="font-display text-3xl md:text-4xl font-light text-foreground mt-4 mb-4">
            Página não encontrada
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            A página que procura não existe ou foi movida. Verifique o endereço ou volte à página inicial.
          </p>
          <Button variant="hero" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao início
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
