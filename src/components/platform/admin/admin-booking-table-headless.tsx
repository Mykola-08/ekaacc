'use client';

import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { getAdminBookings, adminCancelBooking } from '@/app/actions/admin';
import type { AdminBooking } from '@/app/actions/admin';
import { useToast } from '@/hooks/platform/ui/use-toast';
import {
  Loader2,
  Search,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronDown,
  Filter,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function AdminBookingTableHeadless() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const status = filterStatus === 'all' ? undefined : filterStatus;
      const { bookings: data, total } = await getAdminBookings(page, 10, status, search);
      setBookings(data);
      setTotalPages(Math.ceil(total / 10));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch bookings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, search, toast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await adminCancelBooking(id, 'Admin Cancelled via Dashboard');
      toast({ title: 'Success', description: 'Booking cancelled' });
      fetchBookings();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to cancel booking', variant: 'destructive' });
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      case 'completed':
        return 'bg-green-50 text-green-700 ring-green-600/20';
      case 'canceled':
        return 'bg-red-50 text-red-700 ring-red-600/20';
      default:
        return 'bg-muted/30 text-foreground/90 ring-gray-600/20';
    }
  };

  const statusOptions = [
    { id: 'all', name: 'All Statuses' },
    { id: 'scheduled', name: 'Scheduled' },
    { id: 'completed', name: 'Completed' },
    { id: 'canceled', name: 'Canceled' },
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="group relative w-full sm:w-96">
          <Search className="text-muted-foreground/80 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transition-colors group-focus-within:text-blue-500" />
          <input
            type="text"
            placeholder="Search bookings..."
            className="bg-muted/30 focus:bg-card text-foreground placeholder:text-muted-foreground/80 w-full rounded-2xl border-transparent py-3 pr-4 pl-10 font-medium transition-all duration-200 outline-none focus:border-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Listbox value={filterStatus} onChange={setFilterStatus}>
          <div className="relative z-20 mt-1 w-full sm:w-48">
            <ListboxButton className="bg-card relative w-full cursor-pointer rounded-2xl py-3 pr-10 pl-4 text-left shadow-sm ring-1 ring-gray-200 ring-inset focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm sm:leading-6">
              <span className="block truncate capitalize">
                {statusOptions.find((o) => o.id === filterStatus)?.name || 'Filter'}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <Filter className="text-muted-foreground/80 h-4 w-4" aria-hidden="true" />
              </span>
            </ListboxButton>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ListboxOptions className="bg-card ring-opacity-5 absolute mt-1 max-h-60 w-full overflow-auto rounded-2xl py-1 text-base shadow-lg ring-1 ring-black focus:outline-none sm:text-sm">
                {statusOptions.map((opt) => (
                  <ListboxOption
                    key={opt.id}
                    className={({ active }) =>
                      cn(
                        active ? 'bg-blue-50 text-blue-900' : 'text-foreground',
                        'relative cursor-default py-2 pr-4 pl-10 select-none'
                      )
                    }
                    value={opt.id}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={cn('block truncate', selected ? 'font-medium' : 'font-normal')}
                        >
                          {opt.name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                            <Check className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Transition>
          </div>
        </Listbox>
      </div>

      {/* Table */}
      <div className="bg-card overflow-hidden rounded-3xl ring-1 ring-gray-200">
        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-muted-foreground p-20 text-center">No bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="divide-border min-w-full divide-y">
              <thead className="bg-muted/30/50">
                <tr>
                  <th
                    scope="col"
                    className="text-muted-foreground py-4 pr-3 pl-6 text-left text-xs font-semibold tracking-wide uppercase"
                  >
                    Service
                  </th>
                  <th
                    scope="col"
                    className="text-muted-foreground px-3 py-4 text-left text-xs font-semibold tracking-wide uppercase"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="text-muted-foreground px-3 py-4 text-left text-xs font-semibold tracking-wide uppercase"
                  >
                    Therapist
                  </th>
                  <th
                    scope="col"
                    className="text-muted-foreground px-3 py-4 text-left text-xs font-semibold tracking-wide uppercase"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="text-muted-foreground px-3 py-4 text-left text-xs font-semibold tracking-wide uppercase"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="text-muted-foreground relative py-4 pr-6 pl-3 text-right text-xs font-semibold tracking-wide uppercase"
                  >
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border bg-card divide-y">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-muted/30/50 transition-colors">
                    <td className="text-foreground py-4 pr-3 pl-6 text-sm font-medium whitespace-nowrap">
                      {booking.service_name || 'Service'}
                    </td>
                    <td className="text-muted-foreground px-3 py-4 text-sm whitespace-nowrap">
                      <div className="text-foreground font-medium">
                        {booking.customer_name || 'Unknown'}
                      </div>
                      <div className="text-xs">{booking.customer_email}</div>
                    </td>
                    <td className="text-muted-foreground px-3 py-4 text-sm whitespace-nowrap">
                      {booking.provider_name || 'N/A'}
                    </td>
                    <td className="text-muted-foreground px-3 py-4 text-sm whitespace-nowrap">
                      {format(new Date(booking.start_time), 'MMM d, yyyy')}
                      <br />
                      <span className="text-muted-foreground/80 text-xs">
                        {format(new Date(booking.start_time), 'p')}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset',
                          statusColor(booking.status)
                        )}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="relative py-4 pr-6 pl-3 text-right text-sm font-medium whitespace-nowrap">
                      {booking.status === 'scheduled' && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="ml-auto flex items-center justify-end gap-1 rounded-lg px-3 py-1.5 text-red-600 transition-colors hover:bg-red-50 hover:text-red-900"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="border-border bg-card flex items-center justify-between rounded-3xl border-t px-4 py-3 ring-1 ring-gray-100 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-card text-foreground/90 hover:bg-muted/30 relative inline-flex items-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="bg-card text-foreground/90 hover:bg-muted/30 relative ml-3 inline-flex items-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-foreground/90 text-sm">
              Page <span className="font-medium">{page}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-muted-foreground/80 hover:bg-muted/30 relative inline-flex items-center rounded-l-xl px-3 py-2 ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              {/* Simplified pagination numbers - can be expanded */}
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                // Simple logic to show a few pages window around current page could be added here
                // For now just showing first 5 or logic needed
                let pNum = i + 1;
                if (totalPages > 5 && page > 3) pNum = page - 2 + i;
                if (pNum > totalPages) return null;

                return (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={cn(
                      pNum === page
                        ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                        : 'text-foreground hover:bg-muted/30 ring-1 ring-gray-300 ring-inset focus:outline-offset-0',
                      'relative inline-flex items-center px-4 py-2 text-sm font-semibold'
                    )}
                  >
                    {pNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="text-muted-foreground/80 hover:bg-muted/30 relative inline-flex items-center rounded-r-xl px-3 py-2 ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
