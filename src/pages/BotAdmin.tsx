import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Play, Pause, RefreshCw, Settings, Activity, Clock, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BotExecutionLogs from '@/components/BotExecutionLogs';

interface BotConfig {
  id: string;
  enabled: boolean;
  interval_minutes: number;
  last_execution: string | null;
  next_execution: string | null;
}

const BotAdmin = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<BotConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [intervalMinutes, setIntervalMinutes] = useState(10);

  useEffect(() => {
    fetchBotConfig();
  }, []);

  const fetchBotConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('bot_config')
        .select('*')
        .single();

      if (error) throw error;

      setConfig(data);
      setIntervalMinutes(data.interval_minutes);
    } catch (error) {
      console.error('Error fetching bot config:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bot configuration',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBotConfig = async (updates: Partial<BotConfig>) => {
    if (!config) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('bot_config')
        .update(updates)
        .eq('id', config.id);

      if (error) throw error;

      setConfig({ ...config, ...updates });
      toast({
        title: 'Success',
        description: 'Bot configuration updated',
      });
    } catch (error) {
      console.error('Error updating bot config:', error);
      toast({
        title: 'Error',
        description: 'Failed to update bot configuration',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const executeBot = async () => {
    setExecuting(true);
    try {
      const { data, error } = await supabase.functions.invoke('pase-scraper', {
        body: { manual: true }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Bot executed successfully. Processed ${data.recordsProcessed} records.`,
      });
      
      // Refresh config to update last execution time
      await fetchBotConfig();
    } catch (error) {
      console.error('Error executing bot:', error);
      toast({
        title: 'Error',
        description: 'Failed to execute bot',
        variant: 'destructive',
      });
    } finally {
      setExecuting(false);
    }
  };

  const toggleBot = async () => {
    if (!config) return;
    await updateBotConfig({ enabled: !config.enabled });
  };

  const updateInterval = async () => {
    if (!config || intervalMinutes < 1) return;
    await updateBotConfig({ interval_minutes: intervalMinutes });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bot Administration</h1>
          <p className="text-muted-foreground mt-1">
            Manage automated PASE data extraction
          </p>
        </div>
        <Badge variant={config?.enabled ? 'default' : 'secondary'} className="px-3 py-1">
          {config?.enabled ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="logs">Execution Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {config?.enabled ? 'Running' : 'Stopped'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interval</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {config?.interval_minutes} min
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Execution</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {config?.last_execution 
                    ? new Date(config.last_execution).toLocaleString()
                    : 'Never'
                  }
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Execution</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {config?.next_execution 
                    ? new Date(config.next_execution).toLocaleString()
                    : 'Not scheduled'
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Control bot execution and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Bot Status</Label>
                  <div className="text-sm text-muted-foreground">
                    Enable or disable automated data extraction
                  </div>
                </div>
                <Switch
                  checked={config?.enabled || false}
                  onCheckedChange={toggleBot}
                  disabled={updating}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={executeBot}
                  disabled={executing}
                  className="flex items-center gap-2"
                >
                  {executing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  Execute Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bot Configuration</CardTitle>
              <CardDescription>
                Configure automated execution settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="interval">Execution Interval (minutes)</Label>
                <div className="flex gap-2">
                  <Input
                    id="interval"
                    type="number"
                    min="1"
                    max="1440"
                    value={intervalMinutes}
                    onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                    className="w-32"
                  />
                  <Button
                    onClick={updateInterval}
                    disabled={updating || intervalMinutes === config?.interval_minutes}
                  >
                    Update
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  How often the bot should extract data from PASE (1-1440 minutes)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <BotExecutionLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BotAdmin;