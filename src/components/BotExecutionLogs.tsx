import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, CheckCircle, XCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ExecutionLog {
  id: string;
  execution_id: string;
  status: 'running' | 'success' | 'error' | 'timeout';
  start_time: string;
  end_time: string | null;
  records_processed: number;
  error_message: string | null;
  execution_details: any;
  created_at: string;
}

const BotExecutionLogs = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('bot_execution_logs')
        .select('*')
        .order('start_time', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs((data || []) as ExecutionLog[]);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load execution logs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = async () => {
    try {
      const { error } = await supabase
        .from('bot_execution_logs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (error) throw error;

      setLogs([]);
      toast({
        title: 'Success',
        description: 'Execution logs cleared',
      });
    } catch (error) {
      console.error('Error clearing logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear logs',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-600 animate-pulse" />;
      case 'timeout':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default' as const,
      error: 'destructive' as const,
      running: 'secondary' as const,
      timeout: 'outline' as const,
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  const formatDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return 'Running...';
    
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const duration = Math.round((end - start) / 1000);
    
    return `${duration}s`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Execution Logs
            </CardTitle>
            <CardDescription>
              Recent bot execution history and results
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearLogs}
              disabled={logs.length === 0}
            >
              <Trash2 className="h-4 w-4" />
              Clear Logs
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No execution logs found
          </div>
        ) : (
          <ScrollArea className="h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        {getStatusBadge(log.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(log.start_time).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDuration(log.start_time, log.end_time)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {log.records_processed || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {log.error_message ? (
                          <div className="text-sm text-red-600 truncate" title={log.error_message}>
                            {log.error_message}
                          </div>
                        ) : log.execution_details ? (
                          <div className="text-sm text-muted-foreground">
                            {JSON.stringify(log.execution_details).substring(0, 50)}...
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            No details
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default BotExecutionLogs;