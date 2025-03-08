import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { capitalizeEveryFirstChar, capitalizeFirstChar } from '@/utils';
import { useAdminCareer } from '../../hook/useAdminCareer';
import { Career } from '@/features/questionaire/types';

interface CareerTableProps {
  data: Career[];
}

export const CareerTable = ({ data }: CareerTableProps) => {
  const { handleRowClick, setSelectedCareer, setIsEditDialogOpen, getLevelColor } = useAdminCareer();
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (careerId: number) => {
    setExpandedRows((prev) => (prev.includes(careerId) ? prev.filter((id) => id !== careerId) : [...prev, careerId]));
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="px-6">Title</TableHead>
            <TableHead className="px-6">Sector</TableHead>
            <TableHead className="px-6">Career Level</TableHead>
            <TableHead className="px-6">Created</TableHead>
            <TableHead className="px-6">Last Updated</TableHead>
            <TableHead className="w-[50px] px-6"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((career) => (
            <React.Fragment key={career.careerId}>
              <TableRow className="cursor-pointer group hover:bg-gray-50/50" onClick={() => toggleRow(career.careerId)}>
                <TableCell className="font-medium">{capitalizeEveryFirstChar(career.title)}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`text-black transition-colors`}>
                    {capitalizeEveryFirstChar(career.sector)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`${getLevelColor(career.careerLevel)} transition-colors`}>
                    {capitalizeEveryFirstChar(career.careerLevel)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(career.created_on), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(career.updated_on), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {expandedRows.includes(career.careerId) ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </TableCell>
              </TableRow>
              {expandedRows.includes(career.careerId) && (
                <TableRow>
                  <TableCell colSpan={6} className="bg-gray-50/50">
                    <div className="p-4">
                      <h4 className="text-sm font-medium mb-2">Responsibilities</h4>
                      <p className="text-sm text-muted-foreground">{capitalizeFirstChar(career.responsibility)}</p>
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(career);
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCareer(career);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
