import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Upload from 'antd/es/upload';
import Alert from 'antd/es/alert';
import Spin from 'antd/es/spin';
import Flex from 'antd/es/flex';
import Card from 'antd/es/card';
import Button from '../../../../Button/Button';
import { markdown2sections } from '../../../../../utils/legislation';
import {
  parseDocument, utf8Bytes, formatBytes, SUPPORTED_EXTENSIONS,
} from '../../../../../utils/documentImport';
import styles from './styles.module.scss';

// Conservative ceiling per section. The chain's real limit derives from
// blockLength, but a section this large is a drafting mistake long before it
// is a protocol problem, and warning early beats a rejected signature.
const SECTION_WARN_BYTES = 16 * 1024;

/**
 * Experimental importer: turns an uploaded document into legislation sections.
 *
 * Deliberately additive. It writes into the same `sections` form field the
 * manual flow uses and touches nothing else, so the established paste-and-split
 * path keeps working exactly as before even if this fails outright.
 */
export function ExperimentalImport({ form, onImported }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleFile = async (file) => {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const parsed = await parseDocument(file);
      if (!parsed.markdown) {
        setError('No text could be extracted from this file.');
        return;
      }
      const sections = markdown2sections(parsed.markdown);
      const sizes = sections.map(utf8Bytes);
      setResult({
        ...parsed,
        sections,
        sizes,
        totalBytes: sizes.reduce((a, b) => a + b, 0),
        oversized: sizes.filter((n) => n > SECTION_WARN_BYTES).length,
        fileName: file.name,
      });
    } catch (e) {
      setError(e?.message || 'Could not read this document.');
    } finally {
      setBusy(false);
    }
  };

  const applyToForm = () => {
    if (!result) return;
    form.setFieldValue('sections', result.sections.map((value) => ({ value })));
    if (onImported) onImported(result.sections.length);
    setResult(null);
  };

  const count = result ? result.sections.length : 0;
  const sectionsDetectedLabel = result
    ? `${count} section${count === 1 ? '' : 's'} detected from ${result.fileName}`
    : '';

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

        {error && <Alert type="error" showIcon message="Import failed" description={error} />}

        {result?.warnings?.map((w) => (
          <Alert key={w} type="warning" showIcon message={w} />
        ))}

        {result && (
          <>
            <Alert
              type="success"
              showIcon
              message={sectionsDetectedLabel}
              description={(
                <>
                  {`Source: ${result.sourceFormat.toUpperCase()} · total text ${formatBytes(result.totalBytes)}`}
                  {result.promotedHeadings > 0
                    && ` · ${result.promotedHeadings} heading(s) recovered from legal wording`}
                  {result.oversized > 0
                    && ` · ${result.oversized} section(s) over ${formatBytes(SECTION_WARN_BYTES)}`}
                </>
              )}
            />
            <div className={styles.sectionPreview}>
              {result.sections.map((section, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={`${i}-${section.slice(0, 24)}`} className={styles.sectionRow}>
                  <strong>{`#${i + 1}`}</strong>
                  {' '}
                  {section.split('\n')[0].slice(0, 90) || '(empty)'}
                  {' '}
                  <span className={styles.sectionBytes}>{`(${formatBytes(result.sizes[i])})`}</span>
                </div>
              ))}
            </div>
            <Flex gap="10px" wrap>
              <Button
                primary
                onClick={applyToForm}
                aria-label="Replace the legislation sections with the imported document"
                data-testid="legislation-import-apply"
              >
                {`Use these ${result.sections.length} sections`}
              </Button>
              <Button
                onClick={() => setResult(null)}
                aria-label="Discard the imported document"
                data-testid="legislation-import-discard"
              >
                Discard
              </Button>
            </Flex>
            <Alert
              type="warning"
              showIcon
              message={'This replaces the current section list. Review every section before '
                + 'submitting — nothing is signed until you approve it in your wallet.'}
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
