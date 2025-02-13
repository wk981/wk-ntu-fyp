import { useLocation } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from './ui/breadcrumb';
import React from 'react';

export const BreadcrumbCustom = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean); // Remove empty strings

  let accumulatedPath = ''; // To build the full path for each breadcrumb item

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-base font-medium">
        {/* Home Link */}
        <BreadcrumbItem key="home">
          <BreadcrumbLink
            href="/"
            className="text-gray-700 hover:text-primary hover:underline transition-all duration-200"
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Separator after Home */}
        {pathSegments.length > 0 && <BreadcrumbSeparator className="text-gray-400 mx-2" />}

        {pathSegments.map((segment, index) => {
          accumulatedPath += `/${segment}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={accumulatedPath}
                  className={`
                    ${
                      isLast
                        ? 'text-gray-900 font-semibold cursor-default pointer-events-none'
                        : 'text-gray-700 hover:text-primary hover:underline'
                    }
                    transition-all duration-200
                  `}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </BreadcrumbLink>
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator className="text-gray-400 mx-2" />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
