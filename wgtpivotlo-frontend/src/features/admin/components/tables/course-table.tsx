import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { capitalizeEveryFirstChar, capitalizeFirstChar } from '@/utils';
import { Course } from '@/features/courses/types';
import { useAdminCourse } from '../../hook/useAdminCourse';

interface CourseTableProps {
  data: Course[];
}

export const CourseTable = ({ data }: CourseTableProps) => {
  const { handleRowClick, setSelectedCourse, setIsEditDialogOpen, getLevelColor, setIsDeleteDialogOpen } =
    useAdminCourse();
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (careerId: number) => {
    setExpandedRows((prev) => (prev.includes(careerId) ? prev.filter((id) => id !== careerId) : [...prev, careerId]));
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="px-6">Course Name</TableHead>
            <TableHead className="px-6">Rating</TableHead>
            <TableHead className="px-6">Reviews</TableHead>
            <TableHead className="px-6">Source</TableHead>
            <TableHead className="px-6">Created</TableHead>
            <TableHead className="px-6">Last Updated</TableHead>
            <TableHead className="w-[50px] px-6"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((course) => (
            <React.Fragment key={course.course_id}>
              <TableRow
                className="cursor-pointer group hover:bg-gray-50/50"
                onClick={() => toggleRow(course.course_id)}
              >
                <TableCell className="font-medium">{capitalizeEveryFirstChar(course.name)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Badge
                      variant="secondary"
                      className={`${getLevelColor(course.rating.toString())} transition-colors mr-1`}
                    >
                      {course.rating.toFixed(1)}
                    </Badge>
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                </TableCell>
                <TableCell>{course.reviews_counts.toString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-black transition-colors">
                    {capitalizeFirstChar(course.courseSource)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(course.created_on), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(course.updated_on), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {expandedRows.includes(course.course_id) ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </TableCell>
              </TableRow>
              {expandedRows.includes(course.course_id) && (
                <TableRow>
                  <TableCell colSpan={7} className="bg-gray-50/50">
                    <div className="p-4">
                      <h4 className="text-sm font-medium mb-2">Course Link</h4>
                      <a
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {course.link}
                      </a>
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(course);
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCourse(course);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDeleteDialogOpen(true);
                            setSelectedCourse(course);
                          }}
                          variant="destructive"
                        >
                          Delete
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
