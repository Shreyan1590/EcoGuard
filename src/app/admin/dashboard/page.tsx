import { AppShell } from '@/components/shared/app-shell';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockIncidents, mockUsers, mockDevices } from '@/lib/mock-data';
import { MoreHorizontal, PlusCircle, CheckCircle, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminDashboard() {
  const totalIncidents = mockIncidents.length;
  const resolvedIncidents = mockIncidents.filter(i => i.status === 'resolved').length;
  const unresolvedIncidents = totalIncidents - resolvedIncidents;
  const onlineDevices = mockDevices.filter(d => d.status === 'online').length;

  return (
    <AppShell role="administrator">
      <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Administrator Dashboard</h1>
            <p className="text-muted-foreground">Overview of forest monitoring activity.</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalIncidents}</div>
              <p className="text-xs text-muted-foreground">+5 since last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Incidents</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedIncidents}</div>
              <p className="text-xs text-muted-foreground">{unresolvedIncidents} unresolved</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Devices Online</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onlineDevices} / {mockDevices.length}</div>
              <p className="text-xs text-muted-foreground">{mockDevices.length - onlineDevices} offline</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">High-Risk Areas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="relative h-24 overflow-hidden rounded-b-lg">
                  <Image src="https://placehold.co/400x200.png" layout="fill" objectFit="cover" alt="Heatmap of high-risk areas" data-ai-hint="map heatmap" />
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>User Management</CardTitle>
                <CardDescription>Add, edit, or remove user accounts.</CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="#">
                  Add User
                  <PlusCircle className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'administrator' ? 'default' : 'secondary'} className="capitalize">{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Device Management</CardTitle>
                <CardDescription>View status of deployed EcoGuard devices.</CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="#">
                  Add Device
                  <PlusCircle className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Battery</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDevices.map(device => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">{device.id}</TableCell>
                      <TableCell>
                          <Badge variant={device.status === 'online' ? 'default' : 'destructive'} className="capitalize flex items-center gap-1 w-fit">
                            {device.status === 'online' ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                            {device.status}
                          </Badge>
                      </TableCell>
                      <TableCell className="text-right">{device.battery}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
