/**
 * Billing Page (Placeholder)
 * Will be implemented in the billing feature module
 */

import { PageHeader, Card } from '../../../components/ui';

const BillingPage = () => {
  return (
    <div>
      <PageHeader
        title="Billing"
        description="Manage your subscription and billing"
      />
      <Card variant="default">
        <p className="text-gray-600 dark:text-gray-400">Billing content coming soon...</p>
      </Card>
    </div>
  );
};

export default BillingPage;

