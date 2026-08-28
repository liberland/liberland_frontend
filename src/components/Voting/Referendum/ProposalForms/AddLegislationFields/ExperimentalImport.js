import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Upload from 'antd/es/upload';
import Alert from 'antd/es/alert';
import Spin from 'antd/es/spin';
import Flex from 'antd/es/flex';
import Card from 'antd/es/card';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Select from 'antd/es/select';
import TextArea from 'antd/es/input/TextArea';
import Button from '../../../../Button/Button';
import {
  parseDocument,
  splitMarkdownSections,
  utf8Bytes,
  formatBytes,
  SUPPORTED_EXTENSIONS,
  HEADING_LEVEL_OPTIONS,
} from '../../../../../utils/documentImport';
import styles from './styles.module.scss';

// A section this large is a drafting mistake long before it is a protocol
// problem, and flagging it early beats a rejected signature.
const SECTION_WARN_BYTES = 16 * 1024;

/**
 * Experimental importer: upload a document, then review and correct the split
 * before anything touches the form.
 *
 * The markdown on the left is the single source of truth; the sections on the
 * right are a live derived view of it. Automatic parsing is a starting guess,
 * not a verdict — the drafter fixes it here, where the whole document is
 * visible, rather than after the fact across a dozen separate textareas.
 *
 * Strictly additive: it writes into the same `sections` form field the manual
 * flow uses and touches nothing else.
 */
export function ExperimentalImport({ form, onImported }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [meta, setMeta] = useState(null);
  const [maxLevel, setMaxLevel] = useState(6);

  const sections = useMemo(
    () => splitMarkdownSections(markdown, maxLevel),
    [markdown, maxLevel],
  );
  const sizes = useMemo(() => sections.map(utf8Bytes), [sections]);
  const totalBytes = sizes.reduce((a, b) => a + b, 0);
  const oversized = sizes.filter((n) => n > SECTION_WARN_BYTES).length;

  const handleFile = async (file) => {
    setBusy(true);
    setError(null);
    setMeta(null);
    setMarkdown('');
    try {
      const parsed = await parseDocument(file);
      if (!parsed.markdown) {
        setError('No text could be extracted from this file.');
        return;
      }
      setMarkdown(parsed.markdown);
      setMeta({ ...parsed, fileName: file.name });
    } catch (e) {
      setError(e?.message || 'Could not read this document.');
    } finally {
      setBusy(false);
    }
  };

  // Sections are contiguous slices of the markdown, so dropping one is just a
  // rewrite of the source. Keeps the left pane authoritative.
  const removeSection = (index) => {
    setMarkdown(sections.filter((_, i) => i !== index).join('\n\n'));
  };

  const applyToForm = () => {
    if (!sections.length) return;
    form.setFieldValue('sections', sections.map((value) => ({ value })));
    if (onImported) onImported(sections.length);
    setMarkdown('');
    setMeta(null);
  };

  const reset = () => {
    setMarkdown('');
    setMeta(null);
    setError(null);
  };

  return (
    <Card size="small" title="Import a document (experimental)">
      <Flex vertical gap="12px">
        <Alert
          type="info"
          showIcon
          message="Only text is published"
          description={(
            <>
              Images, fonts and formatting are stripped — legislation is stored on-chain
              by the byte, so a single embedded graphic can cost more than an entire
              statute. For the most reliable article-by-article split, export your
              document as
              {' '}
              <strong>.docx</strong>
              {' '}
              (Google Docs: File → Download → Microsoft Word).
            </>
          )}
        />

        {!markdown && (
          <Upload.Dragger
            accept={SUPPORTED_EXTENSIONS.join(',')}
            maxCount={1}
            showUploadList={false}
            beforeUpload={(file) => { handleFile(file); return false; }}
            disabled={busy}
            data-testid="legislation-import-dropzone"
          >
            <p className={styles.dropzoneMain}>
              {busy ? <Spin /> : 'Drop a document here, or click to choose'}
            </p>
            <p className={styles.dropzoneHint}>
              {SUPPORTED_EXTENSIONS.join('  ')}
            </p>
          </Upload.Dragger>
        )}

        {error && <Alert type="error" showIcon message="Import failed" description={error} />}

        {meta?.warnings?.map((w) => (
          <Alert key={w} type="warning" showIcon message={w} />
        ))}

        {markdown && (
          <>
            <Flex wrap gap="12px" align="center" justify="space-between">
              <span className={styles.reviewSummary}>
                {meta ? `${meta.fileName} · ` : ''}
                {`${sections.length} section${sections.length === 1 ? '' : 's'}`}
                {` · ${formatBytes(totalBytes)} on-chain`}
                {oversized > 0 && ` · ${oversized} over ${formatBytes(SECTION_WARN_BYTES)}`}
              </span>
              <Flex gap="8px" align="center" wrap>
                <span className={styles.levelLabel}>Start a new section at:</span>
                <Select
                  value={maxLevel}
                  onChange={setMaxLevel}
                  options={HEADING_LEVEL_OPTIONS}
                  style={{ width: 160 }}
                  data-testid="legislation-import-level"
                />
              </Flex>
            </Flex>

            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <div className={styles.paneTitle}>Document markdown — edit to fix the split</div>
                <TextArea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  autoSize={{ minRows: 16, maxRows: 26 }}
                  spellCheck={false}
                  aria-label="Imported document markdown"
                  data-testid="legislation-import-markdown"
                />
                <div className={styles.paneHint}>
                  A line starting with
                  {' '}
                  <code>#</code>
                  {' '}
                  begins a new section. Add or remove them to correct the split.
                </div>
              </Col>

              <Col xs={24} lg={12}>
                <div className={styles.paneTitle}>
                  {`Resulting sections (${sections.length})`}
                </div>
                <div className={styles.sectionPreview} data-testid="legislation-import-preview">
                  {sections.map((section, i) => (
                    <div
                      // eslint-disable-next-line react/no-array-index-key
                      key={`${i}-${section.slice(0, 24)}`}
                      className={styles.sectionCard}
                      data-testid={`legislation-import-preview-${i + 1}`}
                    >
                      <Flex justify="space-between" align="center" gap="8px">
                        <strong className={styles.sectionCardTitle}>
                          {`#${i + 1}  ${section.split('\n')[0].slice(0, 60)}`}
                        </strong>
                        <Flex gap="8px" align="center">
                          <span className={styles.sectionBytes}>{formatBytes(sizes[i])}</span>
                          <Button
                            nano
                            red
                            onClick={() => removeSection(i)}
                            aria-label={`Remove imported section ${i + 1}`}
                            data-testid={`legislation-import-remove-${i + 1}`}
                          >
                            Remove
                          </Button>
                        </Flex>
                      </Flex>
                      <div className={styles.sectionCardBody}>
                        {section.split('\n').slice(1).join(' ').slice(0, 160) || '(no body text)'}
                      </div>
                    </div>
                  ))}
                  {!sections.length && (
                    <div className={styles.paneHint}>No sections — the document is empty.</div>
                  )}
                </div>
              </Col>
            </Row>

            <Flex gap="10px" wrap>
              <Button
                primary
                onClick={applyToForm}
                disabled={!sections.length}
                aria-label="Replace the legislation sections with these imported sections"
                data-testid="legislation-import-apply"
              >
                {`Use these ${sections.length} sections`}
              </Button>
              <Button
                onClick={reset}
                aria-label="Discard the imported document"
                data-testid="legislation-import-discard"
              >
                Discard
              </Button>
            </Flex>
            <Alert
              type="warning"
              showIcon
              message={'Applying replaces the current section list. Nothing is signed until you '
                + 'approve it in your wallet.'}
            />
          </>
        )}
      </Flex>
    </Card>
  );
}

ExperimentalImport.propTypes = {
  form: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  onImported: PropTypes.func,
};

export default ExperimentalImport;
