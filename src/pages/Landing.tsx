import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Users, MapPin } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const Landing = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          <section className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Forest Rights Act (FRA) Digital Platform</h1>
            <p className="text-lg text-muted-foreground">
              Digitizing, managing, and analyzing land claims to empower tribal and forest-dwelling communities.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Records Digitized
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">10,245</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Beneficiaries Served
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,530</div>
                <p className="text-xs text-muted-foreground">
                  Serving families across the region
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Districts Covered</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  Expanding our reach
                </p>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Landing;