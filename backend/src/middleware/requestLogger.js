const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  console.log('\n' + '='.repeat(80));
  console.log(`📥 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('='.repeat(80));

  if (req.originalUrl.includes('/orders') || req.originalUrl.includes('/checkout') || req.originalUrl.includes('/webhook')) {
    console.log('🔍 Request Details:');
    console.log(`   User ID: ${req.user?.id || 'Not authenticated'}`);
    console.log(`   Admin ID: ${req.admin?.id || 'Not admin'}`);
    console.log(`   Query Params:`, Object.keys(req.query).length ? req.query : 'None');

    if ((req.method === 'POST' || req.method === 'PUT') && !req.originalUrl.includes('/webhook')) {
      console.log(`   Body:`, req.body);
    }

    if (req.originalUrl.includes('/webhook')) {
      console.log(`   Stripe Signature: ${req.headers['stripe-signature'] ? 'Present' : 'Missing'}`);
    }
  }

  const originalEnd = res.end;

  res.end = function(chunk, encoding) {
    const duration = Date.now() - startTime;

    if (req.originalUrl.includes('/orders') || req.originalUrl.includes('/checkout') || req.originalUrl.includes('/webhook')) {
      console.log('📤 Response:');
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Duration: ${duration}ms`);

      if (res.statusCode >= 400) {
        console.log('   ⚠️  Error Response');
      } else {
        console.log('   ✅ Success');
      }
    }

    console.log('='.repeat(80) + '\n');

    originalEnd.call(this, chunk, encoding);
  };

  next();
};

module.exports = requestLogger;
