// Bootstrap 5 Tooltips
dmx.Attribute('bs-tooltip', 'mounted', function (node, attr) {
  this.$addBinding(attr.value, function (value) {
    new bootstrap.Tooltip(node, {
      placement: function(node) {
        var pexpression = node.getAttribute('dmx-bs-placement') || '';
        return dmx.parse(pexpression) || this._element.getAttribute('data-bs-placement') || 'auto';
      },
      title: function() {
        var expression = this.getAttribute('dmx-bs-tooltip') || '';
        return dmx.parse(expression) || this.getAttribute('tooltip-title') || this.getAttribute('title') || '';
      }
    });

    node.setAttribute('tooltip-title', value || '');
  });
});

document.addEventListener('DOMContentLoaded', function(event) {
  new bootstrap.Tooltip(document.body, {
    selector: '[tooltip-title]:not([data-trigger])',
    trigger: 'hover',
    placement: function(node) {
      var pexpression = node.getAttribute('dmx-bs-placement') || '';
      return dmx.parse(pexpression) || this._element.getAttribute('data-bs-placement') || 'auto';
    },
    title: function() {
      var expression = this.getAttribute('dmx-bs-tooltip') || '';
      return dmx.parse(expression) || this.getAttribute('tooltip-title') || this.getAttribute('title') || '';
    }
  });
});